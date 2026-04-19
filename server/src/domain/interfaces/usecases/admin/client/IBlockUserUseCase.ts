import { BlockClientRequestDto } from "../../../../../application/dtos/admin/user/request/block-client-request.dto";

export interface IBlockClientUseCase {
  execute(params: BlockClientRequestDto): Promise<void>;
}
