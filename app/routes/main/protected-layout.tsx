import { isRouteErrorResponse, Link, Outlet } from "react-router";
import { requireUserSession } from "~/lib/session.server";
import type { Route } from "./+types/protected-layout";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserSession(request);
  return null;
}

export default function MainLayout() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // isRouteErrorResponse verifica se o erro é uma Response que nós lançamos (ex: 404, 500)
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 mt-24">
        <h1>Oops! ({error.status})</h1>
        <p>{error.statusText || "Something went wrong"}</p>
        {error.status === 404 && <p>Sorry, this page doesn't exist.</p>}
        <Link to="/">Go back to the homepage</Link>
      </div>
    );
  }

  // Para qualquer outro tipo de erro inesperado (ex: erro de renderização no React)
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-24">
      <h1>Something went wrong</h1>
      <p>{errorMessage}</p>
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}
