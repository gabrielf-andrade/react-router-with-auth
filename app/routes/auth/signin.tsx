import { CheckCircle2, CircleAlert } from "lucide-react";
import { data, redirect } from "react-router";
import { signInFormSchema, type SignInActionResponse, type SignInFormData } from "schemas/signin";
import { z } from "zod";
import SignInForm from "~/components/auth/signin-form";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { BACKEND_URL } from "~/lib/constants";
import { commitSession, getSession } from "~/lib/session.server";
import type { Route } from "./+types/signin";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("user")) {
    return redirect("/dashboard");
  }

  const error = session.get("error");
  const successMessage = session.get("success");
  return data(
    { error, successMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const rawData: SignInFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signInFormSchema.safeParse(rawData);

  // Caminho 1: Erro de validação do Zod.
  // Retorna dados para o formulário, sem redirecionar.
  if (!validatedData.success) {
    return data<SignInActionResponse>(
      {
        success: false,
        message: "Please fix the errors in the form.",
        errors: z.flattenError(validatedData.error),
        inputs: rawData,
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData.data),
    });

    // Caminho 2: Login bem-sucedido.
    // Redireciona o usuário para o dashboard.
    if (response.ok) {
      const responseData = await response.json();
      session.set("user", { id: responseData.id, name: responseData.name });
      session.set("accessToken", responseData.accessToken);
      session.set("refreshToken", responseData.refreshToken);

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    // Caminho 3: Login mal-sucedido (ex: 401 Credenciais Inválidas).
    // Retorna um erro geral para o formulário, sem redirecionar.
    return data<SignInActionResponse>(
      {
        success: false,
        message: response.status === 401 ? "Invalid credentials" : "An unexpected error occurred.",
        inputs: rawData,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error(error);
    // Caminho 4: Erro de conexão/rede.
    // Retorna um erro geral para o formulário, sem redirecionar.
    return data<SignInActionResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Failed to connect to the server.",
        inputs: rawData,
      },
      { status: 500 }
    );
  }
}

export default function SignInPage({ loaderData }: Route.ComponentProps) {
  const { error, successMessage } = loaderData;
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-sm">
        {successMessage && (
          <Alert>
            <CheckCircle2 className="size-4" stroke="oklch(62.7% 0.194 149.214)" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <CircleAlert className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <SignInForm />
    </div>
  );
}
