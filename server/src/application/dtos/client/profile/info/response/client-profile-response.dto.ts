export interface ClientProfileResponseDto {
  id: string;
  userId: string;
  location: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null; 
  isBlocked: boolean | null;
  isVerified: boolean | null;
  createdAt: string;
  updatedAt: string;
}