import { ListBookingsRequestDto } from "../../../../application/dtos/booking/list-bookings-request.dto";
import { UserRole } from "../../../enums/user-role.enum";
import { ListBookingsResponse } from "../../../queries/booking/list-bookings-response";

export interface IListBookingsUseCase {
  execute(
    request: ListBookingsRequestDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<ListBookingsResponse>;
}