import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IAdminGetClientByIdUseCase } from "../../../../domain/interfaces/usecases/admin/client/IAdminGetClientByIdUseCase";
import { IGetClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/IGetClientProfileUseCase";
import { NotFoundError } from "../../../../domain/errors/errors";
import { ClientProfileResponseDto } from "../../../dtos/client/profile/info/response/client-profile-response.dto";

export class AdminGetClientByIdUseCase implements IAdminGetClientByIdUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _getClientProfileUseCase: IGetClientProfileUseCase,
  ) {}

  async execute(userId: string): Promise<ClientProfileResponseDto> {

    const profile = await this._getClientProfileUseCase.execute(userId)

    if(!profile){
      throw new NotFoundError('Profile not found');
    }

    return profile
  }
}
