import Link from "next/link";
import { LandingLayout } from "./LandingLayout";

export async function Home() {
  return (
    <LandingLayout>
      <div>
        <h1>Home</h1>
        <div>feature!</div>
        <div>
          <Link href="/login">Sign In</Link>
        </div>
      </div>
    </LandingLayout>
  );
}
