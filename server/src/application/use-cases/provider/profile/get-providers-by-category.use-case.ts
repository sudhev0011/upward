// application/usecases/provider/profile/GetProvidersByCategoryUseCase.ts
import { PaginatedResult } from '../../../../domain/common.types';
import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IGetProvidersByCategoryUseCase } from '../../../../domain/interfaces/usecases/provider/profile/IGetProvidersByCategoryUseCase';
import { ClientProviderListItem } from '../../../../domain/queries/client/client-provider-list-item';
import { GetProvidersByCategoryRequestDto } from '../../../dtos/provider/profile/info/request/get-providers-by-category-request.dto';

export class GetProvidersByCategoryUseCase implements IGetProvidersByCategoryUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
  ) {}

  async execute(dto: GetProvidersByCategoryRequestDto): Promise<PaginatedResult<ClientProviderListItem>> {
    const { page, limit } = dto;

    const { providers, total } =
      await this._providerProfileRepository.getProvidersByCategory(dto);

    return {
      data: providers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}