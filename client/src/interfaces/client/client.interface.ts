export interface ClientProfile {
  id: string;
  userId: string;
  name: string;
  location: string | null;
  phone: string | null;
  email: string;
  avatarUrl: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientProfileRequest {
  location?: string;
  phone?: string;
}

export interface UpdateClientProfileRequest {
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface ProfileUpdateUrlRequest{
  fileType: string;
}
export interface ProfileUploadUrls{
  uploadUrl: string;
  fileUrl: string;
}

export interface UploadArgs {
  uploadUrl: string;
  file: File;
}