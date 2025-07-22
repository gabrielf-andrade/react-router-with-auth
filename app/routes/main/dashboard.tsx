import { data } from "react-router";
import { secureFetch } from "~/lib/api.server";
import type { Route } from "./+types/dashboard";

interface ProtectedData {
  message: string;
  user: {
    name: string;
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const { response, headers } = await secureFetch(request, "/auth/protected");

  if (!response.ok) throw response;

  const protectedData: ProtectedData = await response.json();

  return data({ protectedData }, { headers });
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { protectedData } = loaderData;

  return (
    <div>
      <h1>Bem-vindo ao Dashboard!</h1>
      <p>Dados protegidos da API: {JSON.stringify(protectedData)}</p>
    </div>
  );
}
