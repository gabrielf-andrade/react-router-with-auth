import type { Route } from "./+types/signup";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function SignUpPage() {
  return <div>SignUpPage</div>;
}
