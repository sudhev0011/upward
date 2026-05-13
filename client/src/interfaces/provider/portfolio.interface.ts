export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description: string | null;
  images: string[];
  thumbnailUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
export interface PortfolioPageResponse {
  items: PortfolioItem[];
  totalCount: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface CreatePortfolioItemRequest {
  title: string;
  description?: string | null;
  images: string[];         
  storageKeys: string[];  
  thumbnailUrl?: string | null;
  tags?: string[];
}

export interface UpdatePortfolioItemRequest {
  title?: string;
  description?: string | null;
  tags?: string[];
  newImages?: string[];      
  newStorageKeys?: string[];  
}
 
export interface RemovePortfolioImageRequest {
  imageUrl: string;      
}

export interface GetUploadUrlRequest {
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/jpg";
}
export interface GetUploadUrlResponse {
  uploadUrl: string;  
  fileUrl: string;     
  storageKey: string;  
}