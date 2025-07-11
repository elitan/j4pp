'use client';

import { getBaseUrl } from '@/utils/getBaseUrl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import type { AppRouter } from '../server/routers/_app';

export const api = createTRPCReact<AppRouter>();

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
