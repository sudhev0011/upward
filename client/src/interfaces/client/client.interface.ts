export interface ClientProfile {
  id: string;
  userId: string;
  name: string;
  location: string | null;
  phone: string | null;
  email: string;
  profilePicture: string | null;
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
}

