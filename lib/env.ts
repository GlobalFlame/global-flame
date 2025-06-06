import { z } from 'zod';

export const env = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  ALBY_API_KEY: z.string().optional(),
  BABY_GIRL_MODE: z.string().default('true'),
}).parse(process.env);
