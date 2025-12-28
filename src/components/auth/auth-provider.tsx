'use client';

import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}