import { UploadResponseDto } from "../../../application/dtos/common/media/upload.dto";
export interface IS3Service {
  generateUploadUrl(
    key: string,
    contentType: string,
  ): Promise<UploadResponseDto>;

  generateDownloadUrl(key: string): Promise<string>;

  isPublicFile(key: string): boolean;

  deleteFile(fileUrl: string): Promise<void>;
}
