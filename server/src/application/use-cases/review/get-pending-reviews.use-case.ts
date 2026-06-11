import { IReviewRepository } from '../../../domain/interfaces/repositories/review/IReviewRepository';
import { IBookingRepository } from '../../../domain/interfaces/repositories/booking/IBookingRepository';
import { BookingStatus } from '../../../domain/enums/booking-status.enum';
import { BookingListItemResponse } from '../../../domain/queries/booking/list-bookings-response';

export class GetPendingReviewsUseCase {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _bookingRepository: IBookingRepository
  ) {}

  async execute(
    clientId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: BookingListItemResponse[]; total: number }> {
    const bookingsResponse = await this._bookingRepository.listBookings({
      clientId,
      status: [BookingStatus.COMPLETED],
      limit: 100,
    });

    if (bookingsResponse.data.length === 0) {
      return { data: [], total: 0 };
    }

    const bookingIds = bookingsResponse.data.map((b) => String(b.id));
    const reviews = await this._reviewRepository.findMany({
      bookingId: { $in: bookingIds },
    });

    const reviewedBookingIds = new Set(reviews.map((r) => String(r.bookingId)));
    const pendingBookings = bookingsResponse.data.filter((b) => !reviewedBookingIds.has(String(b.id)));

    const skip = (page - 1) * limit;
    const paginatedData = pendingBookings.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total: pendingBookings.length,
    };
  }
}
