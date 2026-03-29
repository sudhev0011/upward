import { z } from 'zod';

export const UploadAvatarDtoSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  fileType: z.string().min(1, 'file type is required'),
});

export type UploadAvatarDto = z.infer<typeof UploadAvatarDtoSchema>;
