import { env } from '@/env';

export function getBaseUrl() {
  if (typeof window !== 'undefined') return '';

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return `http://localhost:${env.PORT ?? 3000}`;
}
