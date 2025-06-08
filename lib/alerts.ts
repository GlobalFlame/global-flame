import { env } from '@/lib/env';
export async function alertAdmin(message: string, level: 'critical') {
  if (level === 'critical' && env.SENTRY_DSN) {
    await fetch('https://sentry.io/api', { method: 'POST', body: JSON.stringify({ message }) });
  }
}
