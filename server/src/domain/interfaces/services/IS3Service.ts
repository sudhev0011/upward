import { UploadAvatarResponseDto } from "../../../application/dtos/client/media/upload-avatar-response.dto";

export interface IS3Service {
  generateUploadUrl(
    key: string,
    contentType: string
  ): Promise<UploadAvatarResponseDto>

  generateDownloadUrl(key: string): Promise<string>

  isPublicFile(key: string): boolean

  deleteFile(fileUrl: string): Promise<void>
}