export interface PortfolioItemResponseDto {
  id: string;
  providerId: string;
  title: string;
  description: string | null;
  images: string[];
  thumbnailUrl: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUploadUrlResponseDto {
  uploadUrl: string;
  fileUrl: string;
  storageKey: string;
}