import { z } from "zod";
import { emailSchema } from "./email.schema";
import { passwordSchema } from "./password.schema";
import { UserRole } from "@/constants/user-role";

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: emailSchema,
  password: passwordSchema,
  roles: z.array(z.nativeEnum(UserRole)).min(1),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
