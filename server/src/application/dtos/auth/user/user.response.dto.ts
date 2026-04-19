import { z } from 'zod';
import { UserRole } from '../../../../domain/enums/user-role.enum';
export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roles: z.array(z.nativeEnum(UserRole)),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatar: z.string().optional(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;