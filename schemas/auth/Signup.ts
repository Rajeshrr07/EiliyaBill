import { z } from "zod";

export const passwordRules =
  "Use at least 8 characters with a mix of letters, numbers, and symbols.";

export const SignUpSchema = z
  .object({
    firstName: z.string().min(2, "Enter your first name"),
    lastName: z.string().min(2, "Enter your last name"),
    storeName: z.string().min(2, "Enter your store name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof SignUpSchema>;
