import { auth } from "@clerk/nextjs";
import { SignIn, UserButton } from "@clerk/nextjs";

export async function Home() {
  const { userId }: { userId: string | null } = auth();

  return (
    <div>
      <h1>Home</h1>
      <div>
        SSR website
        {userId ? (
          <div>
            <UserButton />
          </div>
        ) : (
          <div>
            <SignIn />
          </div>
        )}
      </div>
    </div>
  );
}
