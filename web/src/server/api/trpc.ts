import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import {
  getAuth,
  type SignedInAuthObject,
  type SignedOutAuthObject,
} from "@clerk/nextjs/server";
import { type NextResponse, type NextRequest } from "next/server";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";

type CreateNextContextOptions = NodeHTTPCreateContextFnOptions<
  NextRequest,
  NextResponse
>;

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject | null;
  req: NextRequest | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    req: opts.req,
  };
};

export const createContext = async (
  opts: CreateNextContextOptions & { headers: Headers },
) => {
  const auth = getAuth(opts.req);

  return await createContextInner({
    auth,
    req: opts.req,
  });
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
