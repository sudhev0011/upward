export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export class WalletTransaction {
  constructor(
    public readonly id: string | undefined,
    public readonly walletId: string,
    public readonly amount: number,
    public readonly type: WalletTransactionType,
    public readonly description: string,
    public readonly bookingId: string | null,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id?: string;
    walletId: string;
    amount: number;
    type: WalletTransactionType;
    description: string;
    bookingId?: string | null;
    createdAt?: Date;
  }): WalletTransaction {
    return new WalletTransaction(
      data.id,
      data.walletId,
      data.amount,
      data.type,
      data.description,
      data.bookingId ?? null,
      data.createdAt ?? new Date()
    );
  }
}
