import { auth } from "@clerk/nextjs";

export default async function Page() {
  const { userId }: { userId: string | null } = auth();

  return <div>SSR, {userId}</div>;
}
