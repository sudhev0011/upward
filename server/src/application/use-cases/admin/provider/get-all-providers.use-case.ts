import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IGetAllProvidersUseCase } from '../../../../domain/interfaces/usecases/admin/provider/IGetAllProvidersUseCase';
import { GetProvidersQueryDto } from '../../../dtos/admin/provider/request/get-providers-query.dto';
import { PaginatedProvidersResultDto } from '../../../dtos/admin/provider/response/paginated-providers-result.dto';

export class GetAllProvidersUseCase implements IGetAllProvidersUseCase {
  constructor(private readonly _providerProfileRepository: IProviderProfileRepository) {}

  async execute(query: GetProvidersQueryDto): Promise<PaginatedProvidersResultDto> {
    const { page, limit, search, sortOrder,isApprovedByAdmin,isBlocked,sortBy } = query;

    const result = await this._providerProfileRepository.getAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      isBlocked,
      isApprovedByAdmin
    });

    return {
      providers: result.providers,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }
}