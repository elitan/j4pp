"use client";
import { api } from "@/trpc/react";
import Link from "next/link";

export function Home() {
  const a = api.post.hello.useQuery({ text: "world" });

  return (
    <div>
      <h1>Home</h1>
      <div>feature!</div>
      <div>tRPC: {a.data?.greeting}</div>
      <div>
        <Link href="/login">Sign In</Link>
      </div>
    </div>
  );
}
