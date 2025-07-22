import { redirect, type Session, type SessionStorage } from "react-router";
import { BACKEND_URL } from "~/lib/constants";
import type { SessionData } from "./session.server";
import { commitSession, destroySession, requireUserSession } from "./session.server";

interface FetchWithAuthOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface FetchWithAuthResult {
  response: Response;
  setCookieHeader?: string | null;
}

interface SecureFetchResult {
  response: Response;
  headers: Headers;
}

/**
 * Um wrapper para fetch que adiciona o token de autenticação e lida com a renovação do token.
 * Ele deve ser usado DENTRO de loaders e actions.
 * @param session O objeto de sessão atual.
 * @param commitSession A função para commitar a sessão e gerar o header Set-Cookie.
 * @param destroySession A função para destruir a sessão em caso de falha.
 * @param endpoint O endpoint do recurso a ser buscado. Deve ser uma URL relativa e começar com "/".
 * @param options As opções do fetch.
 * @returns Um objeto contendo a resposta e, opcionalmente, um header Set-Cookie atualizado.
 */
async function fetchWithAuth(
  session: Session<SessionData, any>,
  commitSession: SessionStorage<SessionData, any>["commitSession"],
  destroySession: SessionStorage<SessionData, any>["destroySession"],
  endpoint: RequestInfo | URL,
  options: FetchWithAuthOptions = {}
): Promise<FetchWithAuthResult> {
  const accessToken = session.get("accessToken");

  const url = `${BACKEND_URL}${endpoint}`;

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    const refreshToken = session.get("refreshToken");

    if (!refreshToken) {
      throw redirect("/auth/signin", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    try {
      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh token");
      }

      const newTokens = await refreshResponse.json();

      session.set("accessToken", newTokens.accessToken);
      session.set("refreshToken", newTokens.refreshToken);

      options.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Request failed even after token refresh");
      }

      return {
        response,
        setCookieHeader: await commitSession(session),
      };
    } catch (error) {
      console.error("Token refresh failed, logging out:", error);
      throw redirect("/auth/signin", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }
  }

  return { response, setCookieHeader: null };
}

/**
 * Fornece um wrapper de fetch seguro para uso em loaders e actions.
 * 1. Garante que o usuário está logado (chama requireUserSession).
 * 2. Realiza a chamada de API com renovação de token (chama authFetch).
 * 3. Sempre retorna a Response crua e os headers para o caller decidir o que fazer.
 *
 * @param request - O objeto Request do loader/action
 * @param apiEndpoint - O endpoint do recurso a ser buscado, deve ser uma URL relativa e comecar com "/"
 * @param options - Opções adicionais para o fetch
 * @returns Uma Promise que resolve para um objeto contendo a response crua e os headers
 * @throws Uma `Response` apenas em caso de erro de autenticação irrecuperável (ex: falha de renovação)
 */
export async function secureFetch(
  request: Request,
  apiEndpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<SecureFetchResult> {
  const session = await requireUserSession(request);
  const responseHeaders = new Headers();

  const { response, setCookieHeader } = await fetchWithAuth(
    session,
    commitSession,
    destroySession,
    apiEndpoint,
    options
  );

  if (setCookieHeader) {
    responseHeaders.set("Set-Cookie", setCookieHeader);
  }

  return { response, headers: responseHeaders };
}
