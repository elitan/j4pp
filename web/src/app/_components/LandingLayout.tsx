import { SignInButton, UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export function LandingLayout(props: Props) {
  const { children } = props;

  const { userId }: { userId: string | null } = auth();

  console.log({ userId });

  const homeUrl = userId ? "/home" : "/";

  return (
    <div>
      <div className="flex w-full items-center justify-between border-b px-4 py-3">
        <div>Logo</div>
        <div className="flex space-x-4">
          <Link href={homeUrl}>Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div className="">
          {userId ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">asd</SignInButton>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
