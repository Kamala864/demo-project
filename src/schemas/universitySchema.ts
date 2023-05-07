import * as z from 'zod';

export const UniversitySchema = z.object({
  name: z.string(),
  description: z.string(),
});
