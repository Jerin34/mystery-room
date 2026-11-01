import { z } from 'zod';

export const submitAccusationSchema = z.object({
  suspectId: z.string().min(1, 'A suspect must be selected for the accusation.'),
});

export type SubmitAccusationInput = z.infer<typeof submitAccusationSchema>;
