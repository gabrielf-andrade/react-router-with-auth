import type { Route } from "./+types/signin";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function SignInPage() {
  return <div>SignInPage</div>;
}
