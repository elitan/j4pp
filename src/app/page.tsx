'use client';

import { api } from '@/components/providers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/file-upload';
import { TodoList } from '@/components/todo-list';

export default function Home() {
  // tRPC queries
  const publicQuery = api.getPublic.useQuery();
  const protectedQuery = api.getProtected.useQuery(undefined, {
    enabled: false, // triggered manually
  });

  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-4xl px-6 py-24'>
        {/* Hero */}
        <div className='mb-16 text-center'>
          <h1 className='text-foreground mb-4 text-6xl font-bold tracking-tight'>
            j4pp
          </h1>
          <p className='text-muted-foreground mb-2 text-xl'>
            Fast starter template optimized for rapid AI-first development
          </p>
          <p className='text-muted-foreground text-sm'>
            Type-safe from database to frontend
          </p>
        </div>

        {/* tRPC Demo */}
        <div className='mb-16 grid gap-8 md:grid-cols-2'>
          {/* Public Data */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Badge variant='default' className='h-2 w-2 rounded-full p-0' />
                <CardTitle>Public Data</CardTitle>
              </div>
              <CardDescription>Anyone can access this endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              {publicQuery.isLoading && (
                <div className='text-muted-foreground text-sm'>Loading...</div>
              )}

              {publicQuery.data && (
                <div className='space-y-2'>
                  <div className='bg-muted rounded-md border p-3 font-mono text-sm'>
                    <div className='text-foreground'>
                      {publicQuery.data.message}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Protected Data */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Badge
                  variant='destructive'
                  className='h-2 w-2 rounded-full p-0'
                />
                <CardTitle>Protected Data</CardTitle>
              </div>
              <CardDescription>
                Requires authentication via Clerk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => protectedQuery.refetch()}
                className='mb-4 w-full'
                variant='default'
              >
                Fetch Protected Data
              </Button>

              {protectedQuery.isLoading && (
                <div className='text-muted-foreground text-sm'>Loading...</div>
              )}

              {protectedQuery.isError && (
                <div className='text-destructive text-sm'>
                  Error: {protectedQuery.error.message}
                </div>
              )}

              {protectedQuery.data && (
                <div className='bg-muted rounded-md border p-3 font-mono text-sm'>
                  <div className='text-foreground whitespace-pre-wrap'>
                    {JSON.stringify(protectedQuery.data, null, 2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Todo List */}
        <div className='mb-16'>
          <div className='mb-6 text-center'>
            <h2 className='text-foreground mb-2 text-2xl font-bold'>
              Todo List
            </h2>
            <p className='text-muted-foreground text-sm'>
              Manage your todos with tRPC and authentication
            </p>
          </div>
          <TodoList />
        </div>

        {/* File Upload Demo */}
        <div className='mb-16'>
          <div className='mb-6 text-center'>
            <h2 className='text-foreground mb-2 text-2xl font-bold'>
              File Upload Demo
            </h2>
            <p className='text-muted-foreground text-sm'>
              Upload files to S3 using tRPC and our files library
            </p>
          </div>
          <FileUpload />
        </div>

        {/* Quick Start */}
        <div className='text-center'>
          <h2 className='text-foreground mb-6 text-2xl font-bold'>
            Quick Start
          </h2>
          <Card className='mx-auto max-w-2xl'>
            <CardContent className='pt-6'>
              <div className='text-left font-mono text-sm'>
                <div className='text-muted-foreground'>
                  # Setup database and generate types
                </div>
                <div className='text-foreground mb-3'>bun run setup</div>
                <div className='text-muted-foreground'># Start development</div>
                <div className='text-foreground'>bun run dev</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className='text-muted-foreground mt-16 text-center text-sm'>
          <p>
            Next.js 15 • tRPC • Kysely • TypeScript • Tailwind • Clerk •
            Postgres • Cursor • Bun • Shadcn/UI
          </p>
        </div>
      </div>
    </div>
  );
}
