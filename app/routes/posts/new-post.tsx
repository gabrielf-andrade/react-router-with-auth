import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { secureFetch } from "~/lib/api.server";
import { BACKEND_URL } from "~/lib/constants";

interface NewPostActionResponse {
  success: boolean;
  message?: string;
  error: string;
  inputs?: {
    title: string;
    content: string;
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const apiUrl = `${BACKEND_URL}/posts`;

  try {
    const { response, headers } = await secureFetch(request, apiUrl, {
      method: "POST",
      body: JSON.stringify(rawData),
    });

    // Caminho 1: SUCESSO. A API retornou 2xx.
    if (response.ok) {
      return redirect("/dashboard", { headers });
    }

    // Caminho 2: ERRO DE VALIDAÇÃO. A API retornou 4xx.
    const errorBody = await response.json();
    return data<NewPostActionResponse>(
      {
        success: false,
        message: "Please fix the errors below.",
        error: errorBody.error,
        inputs: rawData,
      },
      { status: response.status, headers }
    );
  } catch (error) {
    // Caminho 3: ERRO INESPERADO/IRRECUPERÁVEL.
    // O `secureActionFetch` lançou um erro (ex: falha de renovação de token).
    // O ErrorBoundary vai pegar isso.
    if (error instanceof Response) {
      return error;
    }

    // Qualquer outro erro de código inesperado.
    console.error("New post action failed unexpectedly:", error);
    throw new Response("An unexpected error occurred", { status: 500 });
  }
}

// O componente do formulário com `useActionData` permanece o mesmo.
// Ele será renderizado nos caminhos 1 e 2, mas substituído pelo
// ErrorBoundary no caminho 3.
export default function NewPostPage() {
  return (
    <h1>New Post</h1>
    // <form method="post">
    //   <h2>Create New Post</h2>
    //   {actionData?.message && <p>{actionData.message}</p>}

    //   <input name="title" defaultValue={actionData?.inputs?.title} />
    //   {actionData?.errors?.fieldErrors.title && <span>{actionData.errors.fieldErrors.title[0]}</span>}

    //   <textarea name="content" defaultValue={actionData?.inputs?.content} />
    //   {actionData?.errors?.fieldErrors.content && <span>{actionData.errors.fieldErrors.content[0]}</span>}

    //   <button type="submit">Create</button>
    // </form>
  );
}
