"use client";

import { ReactNode } from "react";

// Better Auth doesn't need a provider component like Clerk
// We can just use the client hooks directly
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}