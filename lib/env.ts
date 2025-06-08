import { z } from 'zod';

/** Validate & expose env vars at runtime */
export const env = z
  .object({
    APP_URL:            z.string().url(),
    SUPABASE_URL:       z.string().url(),
    SUPABASE_ANON_KEY:  z.string(),
    ALBY_API_KEY:       z.string(),
    BABY_GIRL_MODE:     z.enum(['true', 'false']).default('true'),
    SENTRY_DSN:         z.string().optional(),
    I18N_LOCALES:       z.string().default('en'),
  })
  .parse(process.env, {
    errorMap: () => ({ message: 'ENV misconfigured — check .env.local!' }),
  });
