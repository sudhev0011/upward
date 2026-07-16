export interface IRescheduleBookingUseCase {
  execute(params: {
    bookingId: string;
    clientId: string;
    newBookingDate: string;
    newStartTime: string | null;
    newLocation: {
      placeId: string;
      address: string;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      coordinates: {
        type: "Point";
        coordinates: [number, number];
      };
    } | null;
  }): Promise<void>;
}
