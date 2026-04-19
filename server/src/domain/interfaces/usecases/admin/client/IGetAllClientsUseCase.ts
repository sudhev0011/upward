import { PaginatedClientsResultDto } from "../../../../../application/dtos/admin/user/response/paginated-client-result.dto";
import { GetClientsQueryDto } from "../../../../../application/dtos/admin/user/request/get-clients-query.dto";

export interface IGetAllClientsUseCase {
  execute(options: GetClientsQueryDto): Promise<PaginatedClientsResultDto>;
}
