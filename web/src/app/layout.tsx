import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider, auth } from "@clerk/nextjs";
import { DashboardLayout } from "./_components/DashboardLayout";
import { LandingLayout } from "./_components/LandingLayout";

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

export default function RootLayout(props: Props) {
  const { children } = props;

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ClerkProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
