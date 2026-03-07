export interface ClientProfileResponseDto {
  id: string;
  userId: string;
  location: string | null;
  phone: string | null;
  avatarUrl: string | null; 
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
}