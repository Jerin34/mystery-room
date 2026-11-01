import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models/User';
import { env } from '../../config/env';
import { RegisterInput, LoginInput } from './auth.validators';

export class AuthService {
  public async register(input: RegisterInput): Promise<{ user: any; token: string }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw { statusCode: 409, code: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists.' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const user = await User.create({
      displayName: input.displayName.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      role: 'USER',
    });

    const token = this.generateToken(user);

    return {
      user: this.toUserDTO(user),
      token,
    };
  }

  public async login(input: LoginInput): Promise<{ user: any; token: string }> {
    const user = await User.findOne({ email: input.email.toLowerCase().trim() });
    if (!user) {
      // Do not reveal email existence to prevent enumeration
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
    }

    const token = this.generateToken(user);

    return {
      user: this.toUserDTO(user),
      token,
    };
  }

  public async getProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User account not found.' };
    }
    return this.toUserDTO(user);
  }

  public generateToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  public toUserDTO(user: IUser) {
    return {
      id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
