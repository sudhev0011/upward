import { NotFoundError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IGetAllServicesWithPagination } from "../../../domain/interfaces/usecases/service/IGetAllServicesWithPaginationUseCase";
import { GetPaginatedServicesDto } from "../../dtos/admin/service/request/get-paginated-services-response.dto";
import { GetServicesResponseDto } from "../../dtos/admin/service/response/paginated-service.response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class GetAllServicesWithPaginationUseCase implements IGetAllServicesWithPagination {
  constructor(private readonly _serviceRepository: IServiceRepository) {}
  async execute(dto: GetPaginatedServicesDto): Promise<GetServicesResponseDto> {
    const result = await this._serviceRepository.getPaginatedServices(dto);

    if (!result) {
      throw new NotFoundError("services not found");
    }

    return {
      data: result.data.map(ServiceMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
