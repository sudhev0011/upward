import { GetProvidersQueryDto } from '../../../../../application/dtos/admin/provider/request/get-providers-query.dto';
import { PaginatedProvidersResultDto } from '../../../../../application/dtos/admin/provider/response/paginated-providers-result.dto';

export interface IGetAllProvidersUseCase {
  execute(query: GetProvidersQueryDto): Promise<PaginatedProvidersResultDto>;
}
