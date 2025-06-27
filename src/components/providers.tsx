'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import type { AppRouter } from '../server/routers/_app';

export const api = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              // Don't retry on unauthorized errors
              if (
                error &&
                typeof error === 'object' &&
                'data' in error &&
                error.data &&
                typeof error.data === 'object' &&
                'code' in error.data &&
                error.data.code === 'UNAUTHORIZED'
              ) {
                return false;
              }
              // Default retry behavior for other errors (3 retries)
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              // Don't retry mutations on unauthorized errors
              if (
                error &&
                typeof error === 'object' &&
                'data' in error &&
                error.data &&
                typeof error.data === 'object' &&
                'code' in error.data &&
                error.data.code === 'UNAUTHORIZED'
              ) {
                return false;
              }
              // Default retry behavior for other errors (3 retries)
              return failureCount < 3;
            },
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
