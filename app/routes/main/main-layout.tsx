import { Outlet } from "react-router";
import type { Route } from "./+types/main-layout";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function MainLayout() {
  return (
    <div>
      MainLayout
      <Outlet />
    </div>
  );
}
