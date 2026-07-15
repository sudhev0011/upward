export class PayoutRequest {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly amount: number,
    public readonly status: "pending" | "transferred" | "rejected",
    public readonly adminNotes: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    amount: number;
    status?: "pending" | "transferred" | "rejected";
    adminNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): PayoutRequest {
    const now = new Date();
    return new PayoutRequest(
      data.id,
      data.providerId,
      data.amount,
      data.status ?? "pending",
      data.adminNotes,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }

  process(status: "transferred" | "rejected", adminNotes?: string): PayoutRequest {
    if (this.status !== "pending") {
      throw new Error("Only pending payout requests can be processed");
    }
    return new PayoutRequest(
      this.id,
      this.providerId,
      this.amount,
      status,
      adminNotes ?? this.adminNotes,
      this.createdAt,
      new Date()
    );
  }
}
