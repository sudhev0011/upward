import { ApproveProviderDto } from '../../../../../application/dtos/admin/provider/request/approve-provider-request.dto';

export interface IApproveProviderUseCase {
  execute(data: ApproveProviderDto): Promise<void>;
}
