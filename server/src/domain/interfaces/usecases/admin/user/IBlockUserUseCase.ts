import { BlockUserRequestDto } from '../../../../../application/dtos/admin/user/request/block-user-request.dto';

export interface IBlockUserUseCase {
  execute(params: BlockUserRequestDto): Promise<void>;
}