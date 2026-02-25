import { z } from 'zod';
import { ClientProfileResponseDto } from '../../client/profile/info/response/client-profile-response.dto';
export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  isVerified: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  avatar: z.string().optional(),
  seekerProfile: z.custom<ClientProfileResponseDto>().optional(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;