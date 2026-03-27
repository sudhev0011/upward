import { UploadAvatarDto } from '../../../../../application/dtos/client/media/upload-avatar.dto';
import { UploadAvatarResponseDto } from '../../../../../application/dtos/client/media/upload-avatar-response.dto';
export interface IUploadAvatarUseCase {
  execute(dto: UploadAvatarDto): Promise<UploadAvatarResponseDto>;
}
