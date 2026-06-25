import { AuthorizationError, NotFoundError } from "../../../domain/errors/errors";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IClientCompleteBookingUseCase } from "../../../domain/interfaces/usecases/booking/IClientCompleteBookingUseCase";

export class ClientCompleteBookingUseCase
  implements IClientCompleteBookingUseCase
{
  constructor(
    private readonly bookingRepository:
      IBookingRepository,
  ) {}

  async execute(
    clientId: string,
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
      booking.clientId !==
      clientId
    ) {
      throw new AuthorizationError(
        "You cannot complete this booking",
      );
    }

    const updatedBooking =
      booking.markClientComplete();

    await this.bookingRepository.update(
      booking.id!,
      updatedBooking,
    );
  }
}