import * as z from 'zod';

export const StudentModel = z.object({
  name: z.any(),
  description: z.any(),
});
