export interface IGetChatUploadUrlUseCase {
  execute(data: {
    userId: string;
    fileName: string;
    contentType: string;
  }): Promise<{ uploadUrl: string; fileUrl: string; storageKey: string }>;
}
