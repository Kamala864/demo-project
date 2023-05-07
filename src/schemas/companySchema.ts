import * as z from 'zod';

export const CompanySchema = z.object({
  name: z.string(),
  description: z.string(),
});
