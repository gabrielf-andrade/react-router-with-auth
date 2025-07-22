import { Outlet } from "react-router";
import type { Route } from "./+types/auth-layout";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function AuthLayout() {
  return (
    <div>
      AuthLayout
      <Outlet />
    </div>
  );
}
