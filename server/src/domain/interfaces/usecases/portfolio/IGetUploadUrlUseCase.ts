export interface IGetUploadUrlUseCase {
  execute(data: {
    providerId: string;
    fileName: string;
    contentType: string;
  }): Promise<{ uploadUrl: string; fileUrl: string; storageKey: string }>;
}