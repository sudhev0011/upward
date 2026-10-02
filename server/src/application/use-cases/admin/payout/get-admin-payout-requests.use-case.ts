import {
  IGetAdminPayoutRequestsUseCase,
  PaginatedPayoutRequestsResponse,
  PayoutRequestPaginationOptions,
} from "../../../../domain/interfaces/usecases/admin/payout/IGetAdminPayoutRequestsUseCase";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";

export class GetAdminPayoutRequestsUseCase implements IGetAdminPayoutRequestsUseCase {
  constructor(
    private readonly payoutRequestRepository: IPayoutRequestRepository,
    private readonly userRepository?: IUserRepository,
    private readonly providerBankRepository?: IProviderBankRepository
  ) {}

  async execute(
    options?: PayoutRequestPaginationOptions
  ): Promise<PaginatedPayoutRequestsResponse> {
    return this.payoutRequestRepository.findAll(options);
  }
}
