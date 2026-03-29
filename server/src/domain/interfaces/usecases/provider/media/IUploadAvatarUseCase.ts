import { UploadAvatarDto } from "../../../../../application/dtos/provider/media/upload-avatar.dto";
import { UploadAvatarResponseDto } from "../../../../../application/dtos/provider/media/upload-avatar-response.dto";

export interface IUploadAvatarUseCase {
  execute(dto: UploadAvatarDto): Promise<UploadAvatarResponseDto>;
}
