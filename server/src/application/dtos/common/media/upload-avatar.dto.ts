import { z } from "zod";

export const UploadDtoSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fileType: z.string().min(1, "file type is required"),
});

export type UploadDto = z.infer<typeof UploadDtoSchema>;
