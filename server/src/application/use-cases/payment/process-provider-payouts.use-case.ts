import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IProcessProviderPayoutsUseCase } from "../../../domain/interfaces/usecases/payment/IProcessProviderPayoutsUseCase";
import { IReleaseProviderPayoutUseCase } from "../../../domain/interfaces/usecases/payment/IReleaseProviderPayoutUseCase";

export class ProcessProviderPayoutsUseCase implements IProcessProviderPayoutsUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,

    private readonly releaseProviderPayoutUseCase: IReleaseProviderPayoutUseCase,
  ) {}

  async execute(): Promise<Number> {
    const before = new Date();

    const bookings =
      await this.bookingRepository.findBookingsReadyForPayout(before);
    let processedCount = 0;
    for (const booking of bookings) {
      try {
        await this.releaseProviderPayoutUseCase.execute(booking.id!);
        processedCount++;
      } catch (error) {
        console.error(
          `Failed to release payout for booking ${booking.bookingId}`,
          error,
        );
      }
    }

    return processedCount;
  }
}
