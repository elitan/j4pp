import { LandingLayout } from "../_components/LandingLayout";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { children } = props;
  return <LandingLayout>{children}</LandingLayout>;
}
