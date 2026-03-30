import { z } from "zod";

export const UploadResponseDtoSchema = z.object({
  uploadUrl: z.string().min(1, "upload url is required"),
  fileUrl: z.string().min(1, "file url is required"),
});

export type UploadResponseDto = z.infer<typeof UploadResponseDtoSchema>;
