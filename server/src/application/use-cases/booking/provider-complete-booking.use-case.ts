import { AuthorizationError, NotFoundError } from "../../../domain/errors/errors";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IProviderCompleteBookingUseCase } from "../../../domain/interfaces/usecases/booking/IProviderCompleteBookingUseCase";

export class ProviderCompleteBookingUseCase
  implements IProviderCompleteBookingUseCase
{
  constructor(
    private readonly bookingRepository:
      IBookingRepository,
  ) {}

  async execute(
    providerId: string,
    bookingId: string,
  ): Promise<void> {

    const booking =
      await this.bookingRepository.findById(
        bookingId,
      );

    if (!booking) {
      throw new NotFoundError(
        "Booking not found",
      );
    }

    if (
      booking.providerId !==
      providerId
    ) {
      throw new AuthorizationError(
        "You cannot complete this booking",
      );
    }

    const updatedBooking =
      booking.markProviderComplete();

    await this.bookingRepository.update(
      booking.id!,
      updatedBooking,
    );
  }
}