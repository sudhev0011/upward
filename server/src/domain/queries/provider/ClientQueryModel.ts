export interface ClientQueryModel {
  id: string;
  userId: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  location: string | null;
  profilePicture: string | null;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
