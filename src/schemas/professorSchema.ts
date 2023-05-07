import * as z from 'zod';

export const ProfessorSchema = z.object({
  name: z.string(),
  description: z.string(),
  universityId: z.string().optional(),
});
