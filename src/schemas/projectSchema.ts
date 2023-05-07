import * as z from 'zod';

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  universityId: z.string().optional(),
  companyId: z.string().optional(),
});
