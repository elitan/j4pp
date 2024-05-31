import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    req,
    auth: getAuth(req),
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: req,
    createContext: () => createContext(req),
    onError: ({ error, path, ...rest }) => {
      console.log("Error in tRPC handler on path", path);
      console.log(error);
      console.log(rest);
      console.log("---");
    },
  });

export { handler as GET, handler as POST };
