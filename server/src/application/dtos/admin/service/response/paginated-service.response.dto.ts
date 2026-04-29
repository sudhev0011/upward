import { ServiceResponseDto } from "./service-response.dto";

export interface GetServicesResponseDto {
  data: ServiceResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
