import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IGetProviderServicesByCategoryUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IGetProviderServiceByCategoryUseCase";
import { GetPaginatedProviderServicesDto } from "../../../dtos/provider/providerService/request/get-paginates-provider-services.dto";
import { PaginatedProviderServicesGroupedByCategoryDto } from "../../../dtos/provider/providerService/response/provider-services-grouped-by-category.dto";
import { ProviderServiceViewMapper } from "../../../mapers/provider/provider-service-view.mapper";

export class GetProviderServicesByCategoryUseCase implements IGetProviderServicesByCategoryUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _providerServiceRepository: IProviderServiceRepository,
  ) {}
  async execute(data: {
    providerId: string;
    query: GetPaginatedProviderServicesDto;
  }): Promise<PaginatedProviderServicesGroupedByCategoryDto> {
    const user = await this._userRepository.findById(data.providerId);

    if (!user) {
      throw new NotFoundError("user not found: The provider does not exsist");
    }

    const providerServices =
      await this._providerServiceRepository.findGroupedByCategory(
        data.providerId,
        data.query,
      );

    const mapped = ProviderServiceViewMapper.toDtoList(providerServices.data);

    return {
      data: mapped,
      total: providerServices.total,
      page: providerServices.page,
      limit: providerServices.limit,
      totalPages: providerServices.totalPages,
    };
  }
}
