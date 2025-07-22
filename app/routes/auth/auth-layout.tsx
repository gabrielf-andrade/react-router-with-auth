import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen clouds-gradient">
      <Outlet />
    </div>
  );
}
