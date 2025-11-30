import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false).optional(),
})

export type LoginValues = z.infer<typeof LoginSchema>
