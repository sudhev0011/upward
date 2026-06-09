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

  bookingId: string;
  
  status: string;

  paymentStatus: string;

  paymentType: string;

  totalAmount: number;

  paidAmount: number;

  remainingAmount: number;

  refundAmount: number;

  bookingDate: string;

  bookingMode: string;

  startDateTime: string | null;

  endDateTime: string | null;

  notes: string | null;

  requirements: string[];

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
  } | null;

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

export interface WalletTransactionResponse {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  bookingId: string | null;
  createdAt: string;
}

export interface WalletResponse {
  balance: number;
  transactions: WalletTransactionResponse[];
}