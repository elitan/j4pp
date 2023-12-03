import { auth } from "@clerk/nextjs";
import { Home } from "@/components/Home";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js",
  description: "Created by j4pp",
};

export default async function Page() {
  const { userId }: { userId: string | null } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <Home />;
}
