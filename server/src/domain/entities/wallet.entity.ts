export class Wallet {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly balance: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    userId: string;
    balance?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): Wallet {
    const now = new Date();
    return new Wallet(
      data.id,
      data.userId,
      data.balance ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }

  credit(amount: number): Wallet {
    if (amount <= 0) {
      throw new Error("Amount to credit must be greater than zero");
    }
    return new Wallet(
      this.id,
      this.userId,
      this.balance + amount,
      this.createdAt,
      new Date()
    );
  }

  debit(amount: number): Wallet {
    if (amount <= 0) {
      throw new Error("Amount to debit must be greater than zero");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }
    return new Wallet(
      this.id,
      this.userId,
      this.balance - amount,
      this.createdAt,
      new Date()
    );
  }
}
