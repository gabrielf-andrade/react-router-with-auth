import type { Route } from "./+types/profile";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function ProfilePage() {
  return <div>ProfilePage</div>;
}
