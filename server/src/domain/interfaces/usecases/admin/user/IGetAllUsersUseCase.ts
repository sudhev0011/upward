import { PaginatedUsersResultDto } from '../../../../../application/dtos/admin/user/response/paginated-user-result.dto';
import { GetUsersQueryDto } from '../../../../../application/dtos/admin/user/request/get-users-query.dto';

export interface IGetAllUsersUseCase {
  execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto>;
}
