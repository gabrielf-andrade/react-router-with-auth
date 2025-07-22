import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.email("Please enter a valid email address").trim(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .trim(),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export interface SignUpActionResponse {
  success: boolean;
  message: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: {
      [K in keyof SignUpFormData]?: string[];
    };
  };
  inputs?: SignUpFormData;
}
