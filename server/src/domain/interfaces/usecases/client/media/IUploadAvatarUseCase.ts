import { UploadDto } from "../../../../../application/dtos/common/media/upload-avatar.dto";
import { UploadResponseDto } from "../../../../../application/dtos/common/media/upload.dto";
export interface IUploadAvatarUseCase {
  execute(dto: UploadDto): Promise<UploadResponseDto>;
}
