import * as z from 'zod';

export const StudentSchema = z.object({
  name: z.string(),
  description: z.string(),
  universityId: z.string().optional(),
  professorId: z.string().optional(),
});
