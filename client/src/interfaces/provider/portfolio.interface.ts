// ─── Portfolio Item (from backend response) ───────────────────────────────────

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

// ─── Requests ─────────────────────────────────────────────────────────────────

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
  images: string[];         // S3 public URLs (after upload)
  storageKeys: string[];    // S3 keys (same order as images)
  thumbnailUrl?: string | null;
  tags?: string[];
}

export interface UpdatePortfolioItemRequest {
  title?: string;
  description?: string | null;
  tags?: string[];
  newImages?: string[];       // appended to existing images
  newStorageKeys?: string[];  // matching storageKeys for newImages
}
 
export interface RemovePortfolioImageRequest {
  imageUrl: string;           // public URL of the image to remove
}

export interface GetUploadUrlRequest {
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp" | "image/jpg";
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface GetUploadUrlResponse {
  uploadUrl: string;   // presigned S3 URL — PUT directly to this
  fileUrl: string;     // final public CDN URL — save this in DB
  storageKey: string;  // S3 key — send to backend on create
}