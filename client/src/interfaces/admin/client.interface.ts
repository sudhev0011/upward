import { ClientProfile } from "../client/client.interface";

export interface ClientProfilesResponse {
  clients: ClientProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlockClientRequest{
    userId: string;
    isBlocked: boolean;
}