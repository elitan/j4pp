"use client";
import { api } from "@/trpc/react";

export function Dashboard() {
  const helloQuery = api.post.hello.useQuery({ text: "world" });

  return (
    <div className="bg-gray-900">
      <p className="text-2xl text-white">
        {helloQuery.data ? helloQuery.data.greeting : "Loading tRPC query..."}
      </p>
    </div>
  );
}
