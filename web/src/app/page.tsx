"use client";
import { api } from "@/trpc/react";
import { UserButton } from "@clerk/nextjs";

export default function Page() {
  const helloQuery = api.post.hello.useQuery({ text: "world" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          j4pp
        </h1>
        <UserButton />
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {helloQuery.data
              ? helloQuery.data.greeting
              : "Loading tRPC query..."}
          </p>
        </div>
      </div>
    </main>
  );
}
