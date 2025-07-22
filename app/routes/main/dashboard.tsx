import type { Route } from "./+types/dashboard";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function DashboardPage() {
  return <div>DashboardPage</div>;
}
