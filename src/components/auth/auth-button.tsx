'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signIn, signOut, signUp, useSession } from '@/lib/auth-client';

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className='bg-muted h-8 w-8 animate-pulse rounded-full' />;
  }

  if (!session?.user) {
    return (
      <>
        <Button
          onClick={() =>
            signIn.email({
              email: 'demo@example.com',
              password: 'password',
            })
          }
          variant='outline'
        >
          Sign In
        </Button>
        <Button
          onClick={() =>
            signUp.email({
              email: 'demo@example.com',
              name: 'Demo User',
              password: 'password',
            })
          }
          variant='outline'
        >
          Sign Up
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={session.user.image || undefined}
              alt={session.user.name || undefined}
            />
            <AvatarFallback>
              {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuItem className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {session.user.name}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {session.user.email}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
