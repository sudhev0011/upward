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

export interface PortfolioPageResponseDto {
  items: PortfolioItemResponseDto[];
  totalCount: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface GetUploadUrlResponseDto {
  uploadUrl: string;
  fileUrl: string;
  storageKey: string;
}
