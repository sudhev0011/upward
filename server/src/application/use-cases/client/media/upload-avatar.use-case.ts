import { IS3Service } from "../../../../domain/interfaces/services/IS3Service"
import { IUploadAvatarUseCase } from "../../../../domain/interfaces/usecases/client/media/IUploadAvatarUseCase"
import { UploadAvatarResponseDto } from "../../../dtos/client/media/upload-avatar-response.dto";
import { UploadAvatarDto } from "../../../dtos/client/media/upload-avatar.dto"

export class UploadAvatarUseCase implements IUploadAvatarUseCase {

  constructor(private readonly _s3Service: IS3Service,) {}

  async execute(dto: UploadAvatarDto): Promise<UploadAvatarResponseDto> {

    const {userId, fileType} = dto;
    const allowedTypes = ["image/jpeg", "image/png"]

    if (!allowedTypes.includes(fileType)) {
      throw new Error("Invalid file type")
    }

    const ext = fileType.split("/")[1]

    const key = `profiles/${userId}-${Date.now()}.${ext}`
    return await this._s3Service.generateUploadUrl(key, fileType)
  }
}