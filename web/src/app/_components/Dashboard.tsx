"use client";
import { api } from "@/trpc/react";

export function Dashboard() {
  const helloQuery = api.post.hello.useQuery({ text: "j4pp" });

  return (
    <div className="p-4">
      <p className="text-2xl text-gray-800">
        {helloQuery.data ? helloQuery.data.greeting : "Loading tRPC query..."}
      </p>
    </div>
  );
}
