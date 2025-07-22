import { data, redirect } from "react-router";
import { signUpFormSchema, type SignUpActionResponse, type SignUpFormData } from "schemas/signup";
import { z } from "zod";
import SignUpForm from "~/components/auth/signup-form";
import { BACKEND_URL } from "~/lib/constants";
import { commitSession, getSession } from "~/lib/session.server";
import type { Route } from "./+types/signup";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("user")) {
    return redirect("/dashboard");
  }

  return data(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const rawData: SignUpFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signUpFormSchema.safeParse(rawData);

  // Caminho 1: Erro de validação do Zod.
  // Retorna dados para o formulário, sem redirecionar.
  if (!validatedData.success) {
    return data<SignUpActionResponse>(
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
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData.data),
    });

    // Caminho 2: Cadastro bem-sucedido.
    // Redireciona para a página de login com uma mensagem de sucesso.
    if (response.ok) {
      session.flash("success", "Account created successfully! Please sign in.");
      return redirect("/auth/signin", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    // Caminho 3: Cadastro mal-sucedido (ex: 409 Usuário já existe).
    // Retorna um erro geral para o formulário, sem redirecionar.
    return data<SignUpActionResponse>(
      {
        success: false,
        message:
          response.status === 409 ? "A user with this email already exists." : "An unknown server error occurred.",
        inputs: rawData,
      },
      { status: response.status }
    );
  } catch (error) {
    console.error(error);
    // Caminho 4: Erro de conexão/rede.
    // Retorna um erro geral para o formulário, sem redirecionar.
    return data<SignUpActionResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Failed to connect to the server.",
        inputs: rawData,
      },
      { status: 500 }
    );
  }
}

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignUpForm />
    </div>
  );
}
