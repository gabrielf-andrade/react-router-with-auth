import { data, redirect } from "react-router";
import { signInFormSchema, type SignInActionResponse, type SignInFormData } from "schemas/signin";
import { z } from "zod";
import SignInForm from "~/components/ui/auth/signin-form";
import { BACKEND_URL } from "~/lib/constants";
import type { Route } from "./+types/signin";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const rawData: SignInFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signInFormSchema.safeParse(rawData);

  if (!validatedData.success) {
    return data<SignInActionResponse>(
      {
        success: false,
        message: "Please fix the errors in the form",
        errors: z.flattenError(validatedData.error),
        inputs: rawData,
      },
      { status: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData.data),
    });
  } catch (error) {
    console.error(error);
    return data<SignInActionResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Failed to connect to the server.",
      },
      { status: 500 }
    );
  }

  if (response.ok) {
    // TODO: create session
    throw redirect("/dashboard");
  }

  return data<SignInActionResponse>(
    {
      success: false,
      message: response.status === 401 ? "Invalid credentials" : response.statusText,
      inputs: rawData,
    },
    { status: response.status }
  );
}

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignInForm />
    </div>
  );
}
