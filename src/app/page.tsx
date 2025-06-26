'use client';

import { api } from '@/components/providers';

export default function Home() {
  const hello = api.hello.useQuery({ text: 'World' });

  if (hello.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  if (hello.error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-xl text-red-500'>Error: {hello.error.message}</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold'>tRPC v11 Hello World!</h1>
        <p className='text-xl text-gray-600'>{hello.data?.greeting}</p>
        <p className='mt-4 text-sm text-gray-400'>
          This message came from your tRPC server 🚀
        </p>
      </div>
    </div>
  );
}
