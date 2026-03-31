import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IClientProfileRepository } from '../../../../domain/interfaces/repositories/client/IClientProfileRepository';
import { S3Service } from '../../../../infrastructure/external-services/s3/s3.service';
import { IGetAllUsersUseCase } from '../../../../domain/interfaces/usecases/admin/user/IGetAllUsersUseCase';
import { GetUsersQueryDto } from '../../../dtos/admin/user/request/get-users-query.dto';
import { PaginatedUsersResultDto } from '../../../dtos/admin/user/response/paginated-user-result.dto';
import { UserRole } from '../../../../domain/enums/user-role.enum';
import { UserMapper } from '../../../mapers/auth/user.mapper';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _clientProfileRepository: IClientProfileRepository,
    private readonly _s3Service: S3Service,
  ) { }

  async execute(options: GetUsersQueryDto): Promise<PaginatedUsersResultDto> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const criteria: Record<string, unknown> = {};
    if (options.role) {
      criteria.role = options.role as UserRole;
    }
    if (options.isBlocked !== undefined) {
      criteria.isBlocked = options.isBlocked;
    }

    let users = await this._userRepository.findMany(criteria);

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower),
      );
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    const userResponses = await Promise.all(paginatedUsers.map(async (user) => {
      const response = UserMapper.toResponse(user);

      if (user.roles.includes(UserRole.CLIENT)) {
        const profile = await this._clientProfileRepository.findOne({ userId: user.id });
        if (profile && profile.profilePicture) {
          response.avatar = await this._s3Service.generateDownloadUrl(profile.profilePicture);
        }
      }

      return response;
    }));

    return {
      users: userResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
