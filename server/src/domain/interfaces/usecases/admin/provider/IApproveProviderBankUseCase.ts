export interface IApproveProviderBankUseCase {
  execute(providerId: string): Promise<void>;
}
