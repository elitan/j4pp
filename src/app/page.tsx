'use client';

import { api } from '@/components/providers';

export default function Home() {
  // tRPC queries
  const publicQuery = api.getPublic.useQuery();
  const protectedQuery = api.getProtected.useQuery(undefined, {
    enabled: false, // triggered manually
  });

  return (
    <div className='min-h-screen bg-black'>
      <div className='mx-auto max-w-4xl px-6 py-24'>
        {/* Hero */}
        <div className='mb-16 text-center'>
          <h1 className='mb-4 text-6xl font-bold tracking-tight text-white'>
            j4pp
          </h1>
          <p className='mb-2 text-xl text-zinc-300'>
            Fast starter template optimized for rapid development
          </p>
          <p className='text-sm text-zinc-500'>Type-safe from DB to frontend</p>
        </div>

        {/* tRPC Demo */}
        <div className='mb-16 grid gap-8 md:grid-cols-2'>
          {/* Public Data */}
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
              <span className='h-2 w-2 rounded-full bg-green-500'></span>
              Public Data
            </h3>
            <p className='mb-4 text-sm text-zinc-400'>
              Anyone can access this endpoint
            </p>

            {publicQuery.isLoading && (
              <div className='text-sm text-zinc-500'>Loading...</div>
            )}

            {publicQuery.data && (
              <div className='space-y-2'>
                <div className='rounded border border-zinc-700 bg-zinc-800 p-3 font-mono text-sm'>
                  <div className='text-zinc-200'>
                    {publicQuery.data.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Protected Data */}
          <div className='rounded-lg border border-zinc-800 bg-zinc-900 p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
              <span className='h-2 w-2 rounded-full bg-red-500'></span>
              Protected Data
            </h3>
            <p className='mb-4 text-sm text-zinc-400'>
              Requires authentication via Clerk
            </p>

            <button
              onClick={() => protectedQuery.refetch()}
              className='mb-3 w-full rounded bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-zinc-200'
            >
              Fetch Protected Data
            </button>

            {protectedQuery.isLoading && (
              <div className='text-sm text-zinc-500'>Loading...</div>
            )}

            {protectedQuery.isError && (
              <div className='text-sm text-zinc-500'>
                Error: {protectedQuery.error.message}
              </div>
            )}

            {protectedQuery.data && (
              <div className='rounded border border-zinc-700 bg-zinc-800 p-3 font-mono text-sm'>
                <div className='whitespace-pre-wrap text-zinc-200'>
                  {JSON.stringify(protectedQuery.data, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start */}
        <div className='text-center'>
          <h2 className='mb-6 text-2xl font-bold text-white'>Quick Start</h2>
          <div className='mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left font-mono text-sm text-white'>
            <div className='text-zinc-400'>
              # Setup database and generate types
            </div>
            <div className='mb-3 text-white'>bun run setup</div>
            <div className='text-zinc-400'># Start development</div>
            <div className='text-white'>bun run dev</div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-16 text-center text-sm text-zinc-500'>
          <p>Next.js 15 • tRPC • Kysely • TypeScript • Tailwind • Clerk</p>
        </div>
      </div>
    </div>
  );
}
