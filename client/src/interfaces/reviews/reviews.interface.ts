export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt?: string;
  client?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  provider?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

export interface ProviderReviewsResponse {
  data: Review[];
  total: number;
}

export interface ClientReviewsResponse {
  data: Review[];
  total: number;
}
