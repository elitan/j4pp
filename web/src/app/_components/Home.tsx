import Link from "next/link";

export async function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div>feature!</div>
      <div>
        <Link href="/login">Sign In</Link>
      </div>
    </div>
  );
}
