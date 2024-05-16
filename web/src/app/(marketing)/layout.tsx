import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ClerkProvider, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { TRPCReactProvider } from "@/trpc/react";
import { auth } from "@clerk/nextjs/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "j4pp",
  description: "Created by j4pp",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;

  const { userId }: { userId: string | null } = auth();

  // this is so that authenticated users can see the landing page too
  const homeUrl = userId ? "/home" : "/";

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            <div>
              <div className="flex w-full items-center justify-between border-b px-4 py-3">
                <div>Logo</div>
                <div className="flex space-x-4">
                  <Link href={homeUrl}>Home</Link>
                  <Link href="/pricing">Pricing</Link>
                  <Link href="/blog">Blog</Link>
                </div>
                <div className="">
                  {userId ? (
                    <Link href="/dashboard">Dashboard</Link>
                  ) : (
                    <SignInButton mode="modal">Sign In</SignInButton>
                  )}
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
