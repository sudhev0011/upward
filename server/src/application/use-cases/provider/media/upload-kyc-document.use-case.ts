import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { IUploadKycDocumentUseCase } from "../../../../domain/interfaces/usecases/provider/media/IUploadKycDocumentUseCase";
import { UploadDto } from "../../../dtos/common/media/upload-avatar.dto";
import { UploadResponseDto } from "../../../dtos/common/media/upload.dto";

export class UploadKycDocumentUseCase implements IUploadKycDocumentUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(dto: UploadDto): Promise<UploadResponseDto> {
    const { userId, fileType } = dto;
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(fileType)) {
      throw new Error(`Invalid file type: ${fileType}. Allowed types are: ${allowedTypes.join(", ")}`);
    }

    const ext = fileType === "application/pdf" ? "pdf" : fileType.split("/")[1];
    const key = `documents/${userId}-kyc-${Date.now()}.${ext}`;
    
    const uploadUrlResponse = await this._s3Service.generateUploadUrl(key, fileType);
    
    return {
      uploadUrl: uploadUrlResponse.uploadUrl,
      fileUrl: uploadUrlResponse.fileUrl
    };
  }
}
