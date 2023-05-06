import * as z from 'zod';

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  universityId: z.number().optional(),
  companyId: z.number().optional(),
});
