import { redirect } from "react-router";
import { commitSession, getSession, Role } from "~/lib/session.server";
import type { Route } from "./+types/google-callback";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name");
  const role = searchParams.get("role") as Role;

  if (!accessToken || !refreshToken || !userId || !name || !role) {
    return redirect("/auth/signin?error=authentication_failed");
  }

  try {
    session.set("user", { id: userId, name, role });
    session.set("accessToken", accessToken);
    session.set("refreshToken", refreshToken);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return redirect("/auth/signin?error=session_creation_failed");
  }
}

export default function GoogleCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
}
