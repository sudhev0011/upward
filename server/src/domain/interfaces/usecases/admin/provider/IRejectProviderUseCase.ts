import { RejectProviderDto } from '../../../../../application/dtos/admin/provider/request/reject-provider-request.dto';
export interface IRejectProviderUseCase {
  execute(data: RejectProviderDto): Promise<void>;
}
