import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters").trim(),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export interface SignInActionResponse {
  success: boolean;
  message: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: {
      [K in keyof SignInFormData]?: string[];
    };
  };
  inputs?: SignInFormData;
}
