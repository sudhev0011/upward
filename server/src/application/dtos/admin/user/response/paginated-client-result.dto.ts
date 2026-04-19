import { ClientProfileResponseDto } from '../../../client/profile/info/response/client-profile-response.dto';
export interface PaginatedClientsResultDto {
  clients: ClientProfileResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}