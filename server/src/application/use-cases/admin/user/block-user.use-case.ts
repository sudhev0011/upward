import { IBlockUserUseCase } from '../../../../domain/interfaces/usecases/admin/user/IBlockUserUseCase';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { BlockUserRequestDto } from '../../../dtos/admin/user/request/block-user-request.dto';

export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(params: BlockUserRequestDto): Promise<void> {
    await this._userRepository.update(params.userId, { isBlocked: params.isBlocked });
  }
}