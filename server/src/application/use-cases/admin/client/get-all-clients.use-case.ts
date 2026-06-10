import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IClientProfileRepository } from "../../../../domain/interfaces/repositories/client/IClientProfileRepository";
import { S3Service } from "../../../../infrastructure/external-services/s3/s3.service";
import { IGetAllClientsUseCase } from "../../../../domain/interfaces/usecases/admin/client/IGetAllClientsUseCase";
import { GetClientsQueryDto } from "../../../dtos/admin/user/request/get-clients-query.dto";
import { PaginatedClientsResultDto } from "../../../dtos/admin/user/response/paginated-client-result.dto";
export class GetAllClientsUseCase implements IGetAllClientsUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _clientProfileRepository: IClientProfileRepository,
    private readonly _s3Service: S3Service,
  ) {}

  async execute(
    options: GetClientsQueryDto,
  ): Promise<PaginatedClientsResultDto> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;

    const { clients, total } = await this._clientProfileRepository.getAll({
      page,
      limit,
      search: options.search,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
      isBlocked: options.isBlocked
    });


    const userResponses = await Promise.all(
      clients.map(async (item) => {
        if (item.avatarUrl) {
          item.avatarUrl = await this._s3Service.generateDownloadUrl(
            item.avatarUrl,
          );
        }

        return item;
      }),
    );

    return {
      clients: userResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
