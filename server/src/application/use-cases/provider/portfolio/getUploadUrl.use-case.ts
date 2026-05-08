import { IGetUploadUrlUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetUploadUrlUseCase";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { GetUploadUrlResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";

export class GetUploadUrlUseCase implements IGetUploadUrlUseCase {
  constructor(private readonly _s3Service: IS3Service) {}
 
  async execute(data: {
    providerId: string;
    fileName: string;
    contentType: string;
  }): Promise<GetUploadUrlResponseDto> {

    const ext = data.fileName.split(".").pop();
    const storageKey = `portfolios/${data.providerId}-${Date.now()}.${ext}`;
 
    const { uploadUrl, fileUrl } = await this._s3Service.generateUploadUrl(
      storageKey,
      data.contentType
    );
 
    return { uploadUrl, fileUrl, storageKey };
  }
}