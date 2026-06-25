export interface IClientCompleteBookingUseCase {
  execute(
    clientId: string,
    bookingId: string,
  ): Promise<void>;
}