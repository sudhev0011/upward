import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IBlockProviderUseCase } from "../../../../domain/interfaces/usecases/admin/provider/IBlockProviderUseCase";
import { BlockProviderRequestDto } from "../../../dtos/admin/provider/request/block-provider-request.dto";

export class BlockProviderUseCase implements IBlockProviderUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(params: BlockProviderRequestDto): Promise<void> {
    await this._userRepository.update(params.userId, {
      isBlocked: params.isBlocked,
    });
  }
}
