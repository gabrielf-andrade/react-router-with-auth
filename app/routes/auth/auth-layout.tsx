import { Outlet } from "react-router";
import type { Route } from "./+types/auth-layout";

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen clouds-gradient">
      <Outlet />
    </div>
  );
}
