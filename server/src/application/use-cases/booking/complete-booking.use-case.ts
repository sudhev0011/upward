import { IBookingRepository } from '../../../domain/interfaces/repositories/booking/IBookingRepository';
import { BookingStatus } from '../../../domain/enums/booking-status.enum';
import { NotFoundError, AuthorizationError, UnprocessableEntityError } from '../../../domain/errors/errors';

export class CompleteBookingUseCase {
  constructor(private readonly _bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, providerId: string): Promise<void> {
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.providerId !== providerId) {
      throw new AuthorizationError('You are not authorized to complete this booking');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new UnprocessableEntityError('Only confirmed bookings can be completed');
    }

    const completedBooking = booking.complete();
    await this._bookingRepository.update(bookingId, completedBooking);
  }
}
