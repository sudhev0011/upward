export interface ClientProfileResponseDto {
  id: string;
  userId: string;
  name: string;
  location: string | null;
  phone: string | null;
  email: string | null; 
  avatarUrl: string | null; 
  dateOfBirth: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
}