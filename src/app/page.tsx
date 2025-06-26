'use client';

import { useState } from 'react';
import { api } from '@/components/providers';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [updateName, setUpdateName] = useState('');
  const [updateBio, setUpdateBio] = useState('');

  // Public procedure - works for everyone
  const hello = api.hello.useQuery({
    text: isSignedIn ? user?.firstName || 'User' : 'World',
  });

  // Protected procedure - only works when signed in
  const profile = api.getProfile.useQuery(undefined, {
    enabled: isSignedIn, // Only run when user is signed in
  });

  // Protected mutation
  const updateProfile = api.updateProfile.useMutation({
    onSuccess: (data) => {
      alert(`Profile updated! ${data.message}`);
      setUpdateName('');
      setUpdateBio('');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateName.trim()) return;

    updateProfile.mutate({
      name: updateName,
      bio: updateBio || undefined,
    });
  };

  if (!isLoaded || hello.isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-center text-4xl font-bold'>
          tRPC v11 + Clerk!
        </h1>

        {/* Public Procedure Section */}
        <div className='mb-8 rounded-lg bg-blue-50 p-6'>
          <h2 className='mb-4 text-2xl font-semibold text-blue-800'>
            🌍 Public Procedure
          </h2>
          <p className='mb-2 text-lg'>
            <strong>Response:</strong> {hello.data?.greeting}
          </p>
          <p className='text-sm text-blue-600'>
            ✅ This procedure works for everyone (signed in or not)
          </p>
        </div>

        {/* Authentication Status */}
        <div className='mb-8 text-center'>
          {isSignedIn ? (
            <div className='rounded-lg bg-green-50 p-4'>
              <p className='text-green-600'>✅ You are signed in!</p>
              <p className='text-sm text-gray-600'>
                Email: {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          ) : (
            <div className='rounded-lg bg-yellow-50 p-4'>
              <p className='text-blue-600'>
                👆 Please sign in using the buttons above to see protected
                content
              </p>
            </div>
          )}
        </div>

        {/* Protected Procedures Section */}
        {isSignedIn ? (
          <div className='space-y-6'>
            {/* Protected Query */}
            <div className='rounded-lg bg-green-50 p-6'>
              <h2 className='mb-4 text-2xl font-semibold text-green-800'>
                🔒 Protected Query
              </h2>
              {profile.isLoading ? (
                <p>Loading profile...</p>
              ) : profile.error ? (
                <p className='text-red-600'>Error: {profile.error.message}</p>
              ) : (
                <div>
                  <p className='mb-2'>
                    <strong>User ID:</strong> {profile.data?.userId}
                  </p>
                  <p className='mb-2'>
                    <strong>Message:</strong> {profile.data?.message}
                  </p>
                  <p className='mb-2'>
                    <strong>Timestamp:</strong> {profile.data?.timestamp}
                  </p>
                  <p className='text-sm text-green-600'>
                    🔒 This data is only accessible to authenticated users
                  </p>
                </div>
              )}
            </div>

            {/* Protected Mutation */}
            <div className='rounded-lg bg-purple-50 p-6'>
              <h2 className='mb-4 text-2xl font-semibold text-purple-800'>
                🔒 Protected Mutation
              </h2>
              <form onSubmit={handleUpdateProfile} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Name (required)
                  </label>
                  <input
                    type='text'
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    className='mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500'
                    placeholder='Enter your name'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Bio (optional)
                  </label>
                  <textarea
                    value={updateBio}
                    onChange={(e) => setUpdateBio(e.target.value)}
                    className='mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500'
                    placeholder='Tell us about yourself'
                    rows={3}
                  />
                </div>
                <button
                  type='submit'
                  disabled={updateProfile.isPending}
                  className='rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50'
                >
                  {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
              <p className='mt-2 text-sm text-purple-600'>
                🔒 This mutation is only available to authenticated users
              </p>
            </div>
          </div>
        ) : (
          <div className='rounded-lg bg-gray-50 p-6'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-600'>
              🔒 Protected Content
            </h2>
            <p className='text-gray-600'>
              Sign in to access protected queries and mutations!
            </p>
          </div>
        )}

        <p className='mt-8 text-center text-sm text-gray-400'>
          This demo shows tRPC v11 with Clerk authentication 🚀
        </p>
      </div>
    </div>
  );
}
