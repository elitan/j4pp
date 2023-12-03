import { auth } from "@clerk/nextjs";
import { Dashboard } from "./_components/Dashboard";
import { Home } from "./_components/Home";

export default async function Page() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    return <Home />;
  }

  return <Dashboard />;
}
