import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../app';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Express } from 'express';

describe('AI Mystery Room API Test Suite', () => {
  let app: Express;
  let authToken: string;
  let testUserId: string;
  let createdCaseId: string;
  let sampleSuspectId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('1. System & Authentication', () => {
    it('should return UP on /health', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('UP');
    });

    it('should register a new detective user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          displayName: 'Detective Poirot',
          email: 'poirot@scotlandyard.example',
          password: 'SecretPassword123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('poirot@scotlandyard.example');
      expect(res.body.data.token).toBeDefined();

      authToken = res.body.data.token;
      testUserId = res.body.data.user.id;
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          displayName: 'Duplicate Poirot',
          email: 'poirot@scotlandyard.example',
          password: 'SecretPassword123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'poirot@scotlandyard.example',
          password: 'SecretPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should get current authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.displayName).toBe('Detective Poirot');
    });
  });

  describe('2. Case Creation & Security No-Leak Check', () => {
    it('should create and generate a mystery case from premise', async () => {
      const res = await request(app)
        .post('/api/v1/cases')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          premise: 'A priceless emerald disappeared from the locked private museum vault during the lunar eclipse.',
          difficulty: 'MEDIUM',
          theme: 'THEFT',
          evidenceIntensity: 'STANDARD',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.suspects.length).toBeGreaterThanOrEqual(3);

      createdCaseId = res.body.data.id;
      sampleSuspectId = res.body.data.suspects[0].id;

      // CRITICAL FAIR-PLAY SECURITY CHECK:
      // Pre-accusation payload MUST NOT leak canonicalCulpritId or solution!
      expect(res.body.data.canonicalCulpritId).toBeUndefined();
      expect(res.body.data.solution).toBeUndefined();
    });

    it('should fetch case briefing without leaking answer', async () => {
      const res = await request(app)
        .get(`/api/v1/cases/${createdCaseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBeDefined();
      expect(res.body.data.canonicalCulpritId).toBeUndefined();
      expect(res.body.data.solution).toBeUndefined();
    });

    it('should list public evidence items for investigation', async () => {
      const res = await request(app)
        .get(`/api/v1/cases/${createdCaseId}/evidence`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      const firstEvidenceId = res.body.data[0].id;
      const detailRes = await request(app)
        .get(`/api/v1/cases/${createdCaseId}/evidence/${firstEvidenceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(detailRes.status).toBe(200);
      expect(detailRes.body.data.content).toBeDefined();
    });

    it('should reject accessing case result before accusation', async () => {
      const res = await request(app)
        .get(`/api/v1/cases/${createdCaseId}/result`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('RESULT_FORBIDDEN');
    });
  });

  describe('3. Accusation, Scoring & Reveal Dossier', () => {
    it('should submit final accusation and receive evidence-grounded reveal', async () => {
      const res = await request(app)
        .post(`/api/v1/cases/${createdCaseId}/accusation`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          suspectId: sampleSuspectId,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.isCorrect).toBe('boolean');
      expect(res.body.data.canonicalCulpritId).toBeDefined();
      expect(res.body.data.solution.reasoning).toBeDefined();
      expect(res.body.data.solution.reconstructedTimeline).toBeDefined();
      expect(res.body.data.solution.evidenceReferences.length).toBeGreaterThan(0);
    });

    it('should reject a second accusation with 409 Conflict', async () => {
      const res = await request(app)
        .post(`/api/v1/cases/${createdCaseId}/accusation`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          suspectId: sampleSuspectId,
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CASE_ALREADY_RESOLVED');
    });

    it('should now allow accessing result endpoint once case is resolved', async () => {
      const res = await request(app)
        .get(`/api/v1/cases/${createdCaseId}/result`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.solution).toBeDefined();
      expect(res.body.data.canonicalCulpritId).toBeDefined();
    });
  });
});
