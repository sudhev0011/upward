import { IBlockClientUseCase } from "../../../../domain/interfaces/usecases/admin/client/IBlockUserUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { BlockClientRequestDto } from "../../../dtos/admin/user/request/block-client-request.dto";

export class BlockClientUseCase implements IBlockClientUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(params: BlockClientRequestDto): Promise<void> {
    await this._userRepository.update(params.userId, {
      isBlocked: params.isBlocked,
    });
  }
}
