export interface IProviderCompleteBookingUseCase {
  execute(
    providerId: string,
    bookingId: string,
  ): Promise<void>;
}