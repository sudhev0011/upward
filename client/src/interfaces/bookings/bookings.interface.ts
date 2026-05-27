export interface ListBookingsRequest {
  page?: number;
  limit?: number;

  search?: string;

  sortOrder?: "asc" | "desc";

  status?: string[];

  paymentStatus?: string[];

  fromDate?: string;
  toDate?: string;
}

export interface BookingListItem {
  id: string;

  status: string;

  paymentStatus: string;

  paymentType: string;

  totalAmount: number;

  paidAmount: number;

  remainingAmount: number;

  refundAmount: number;

  bookingDate: string;

  startDateTime: string;

  endDateTime: string;

  notes: string | null;

  location: {
    placeId: string;

    address: string;

    city?: string | null;

    state?: string | null;

    country?: string | null;

    coordinates: {
      type: "Point";

      coordinates: [number, number];
    };
  };

  client: {
    id: string;

    name?: string;

    email: string;

    avatarFileName?: string | null;
  };

  provider: {
    id: string;

    name?: string;

    email: string;

    avatarFileName?: string | null;
  };

  service: {
    id: string;

    name: string;

    description?: string | null;

    mode: string;
  };

  providerService: {
    id: string;

    price?: number | null;

    status: string;
  };

  createdAt: string;

  updatedAt: string;
}


export interface ListBookingsResponse {
  data: BookingListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}