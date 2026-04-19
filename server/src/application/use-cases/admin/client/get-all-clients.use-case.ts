import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IClientProfileRepository } from "../../../../domain/interfaces/repositories/client/IClientProfileRepository";
import { S3Service } from "../../../../infrastructure/external-services/s3/s3.service";
import { IGetAllClientsUseCase } from "../../../../domain/interfaces/usecases/admin/client/IGetAllClientsUseCase";
import { GetClientsQueryDto } from "../../../dtos/admin/user/request/get-clients-query.dto";
import { PaginatedClientsResultDto } from "../../../dtos/admin/user/response/paginated-client-result.dto";
import { ClientProfileMapper } from "../../../mapers/client/client-profile.mappers";
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

    // 1. Fetch data directly from Client Repository with built-in search/pagination
    const { clients, total } = await this._clientProfileRepository.getAll({
      page,
      limit,
      search: options.search,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
      isBlocked: options.isBlocked
    });


    // 2. Map the results to the response format
    const userResponses = await Promise.all(
      clients.map(async (item) => {
        // 3. Resolve the S3 Signed URL for the profile picture
        if (item.profilePicture) {
          item.profilePicture = await this._s3Service.generateDownloadUrl(
            item.profilePicture,
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
