import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";

import { UserRole } from "../../../domain/enums/user-role.enum";

import { ListBookingsRequestDto } from "../../dtos/booking/list-bookings-request.dto";

import { ListBookingsResponseDto } from "../../dtos/booking/list-bookings-response.dto";

export class ListBookingsUseCase {
  constructor(
    private bookingRepository: IBookingRepository,
  ) {}

  async execute(
    request: ListBookingsRequestDto,

    currentUserId: string,

    currentUserRole: UserRole,
  ): Promise<ListBookingsResponseDto> {
    const repositoryParams = {
      page: request.page,
      limit: request.limit,

      search: request.search,

      sortOrder: request.sortOrder,

      status: request.status,

      paymentStatus: request.paymentStatus,

      fromDate: request.fromDate,
      toDate: request.toDate,
    };

    if (currentUserRole === UserRole.PROVIDER) {
      Object.assign(repositoryParams, {
        providerId: currentUserId,
      });
    }

    if (currentUserRole === UserRole.CLIENT) {
      Object.assign(repositoryParams, {
        clientId: currentUserId,
      });
    }

    return await this.bookingRepository.listBookings(
      repositoryParams,
    );
  }
}