import { BlockProviderRequestDto } from "../../../../../application/dtos/admin/provider/request/block-provider-request.dto";

export interface IBlockProviderUseCase {
  execute(params: BlockProviderRequestDto): Promise<void>;
}