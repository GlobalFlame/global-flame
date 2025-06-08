import { env } from '@/lib/env';
export function trackEvent(event: string, data: object) {
  if (env.SENTRY_DSN) {
    fetch('https://sentry.io/api', { method: 'POST', body: JSON.stringify({ event, data }) });
  }
}
