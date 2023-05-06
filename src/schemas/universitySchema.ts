import * as z from 'zod';

export const UniversitySchema = z.object({
  name: z.any(),
  description: z.any(),
});
