import { IGetAdminPayoutRequestsUseCase, AdminPayoutRequestResponse } from "../../../../domain/interfaces/usecases/admin/payout/IGetAdminPayoutRequestsUseCase";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";

export class GetAdminPayoutRequestsUseCase implements IGetAdminPayoutRequestsUseCase {
  constructor(
    private readonly payoutRequestRepository: IPayoutRequestRepository,
    private readonly userRepository: IUserRepository,
    private readonly providerBankRepository: IProviderBankRepository
  ) {}

  async execute(): Promise<AdminPayoutRequestResponse[]> {
    const payoutRequests = await this.payoutRequestRepository.findAll();
    
    const results: AdminPayoutRequestResponse[] = [];
    
    for (const pr of payoutRequests) {
      const user = await this.userRepository.findById(pr.providerId);
      const bank = await this.providerBankRepository.findByProviderId(pr.providerId);
      
      results.push({
        payoutRequest: pr,
        provider: {
          name: user ? user.name : "Unknown",
          email: user ? user.email : "Unknown",
        },
        bankDetails: bank,
      });
    }
    
    return results;
  }
}
