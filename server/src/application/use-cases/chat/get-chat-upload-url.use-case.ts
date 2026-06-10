import { IGetChatUploadUrlUseCase } from "../../../domain/interfaces/usecases/chat/IGetChatUploadUrlUseCase";
import { IS3Service } from "../../../domain/interfaces/services/IS3Service";

export class GetChatUploadUrlUseCase implements IGetChatUploadUrlUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(data: {
    userId: string;
    fileName: string;
    contentType: string;
  }): Promise<{ uploadUrl: string; fileUrl: string; storageKey: string }> {
    const ext = data.fileName.split(".").pop() || "bin";
    const storageKey = `chat/${data.userId}-${Date.now()}.${ext}`;

    const { uploadUrl, fileUrl } = await this._s3Service.generateUploadUrl(
      storageKey,
      data.contentType
    );

    return { uploadUrl, fileUrl, storageKey };
  }
}
