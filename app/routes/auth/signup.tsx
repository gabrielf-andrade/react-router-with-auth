import { data, redirect } from "react-router";
import { signUpFormSchema, type SignUpActionResponse, type SignUpFormData } from "schemas/signup";
import { z } from "zod";
import SignUpForm from "~/components/ui/auth/signup-form";
import { BACKEND_URL } from "~/lib/constants";
import type { Route } from "./+types/signup";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const rawData: SignUpFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signUpFormSchema.safeParse(rawData);

  if (!validatedData.success) {
    return data<SignUpActionResponse>(
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
    response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData.data),
    });
  } catch (error) {
    console.error(error);
    return data<SignUpActionResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Failed to connect to the server.",
      },
      { status: 500 }
    );
  }

  if (response.ok) {
    throw redirect("/auth/signin");
  }

  return data<SignUpActionResponse>(
    {
      success: false,
      message: response.status === 409 ? "User already exists" : response.statusText,
      inputs: rawData,
    },
    { status: response.status }
  );
}

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignUpForm />
    </div>
  );
}
