import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout(props: Props) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            <div>
              <div className="flex w-full items-center justify-between border-b px-4 py-3">
                <div>Logo</div>
                <div>
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/settings">Settings</Link>
                  <Link href="/home">home</Link>
                </div>
                <div>
                  <UserButton />
                </div>
              </div>
              <div>{children}</div>
            </div>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
