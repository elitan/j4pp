import { UserButton } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout(props: Props) {
  const { children } = props;

  return (
    <div>
      <div className="flex w-full items-center justify-between border-b px-4 py-3">
        <div>Logo</div>
        <div>
          <UserButton />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
