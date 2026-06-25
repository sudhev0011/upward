export interface IReleaseProviderPayoutUseCase {
  execute(
    bookingId: string,
  ): Promise<void>;
}