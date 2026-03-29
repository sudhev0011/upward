import { z } from 'zod';

export const UploadAvatarResponseDtoSchema = z.object({
  uploadUrl: z.string().min(1, 'upload url is required'),
  fileUrl: z.string().min(1, 'file url is required'),
});

export type UploadAvatarResponseDto = z.infer<typeof UploadAvatarResponseDtoSchema>;
