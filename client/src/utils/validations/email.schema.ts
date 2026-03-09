import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .refine((email) => !email.endsWith('@gmial.com'), {
    message: 'Did you mean gmail.com?',
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema, 
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
