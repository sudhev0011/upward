export class ProviderBank {
  constructor(
    public readonly id: string,
    public readonly providerId: string,
    public readonly accountHolderName: string,
    public readonly bankName: string,
    public readonly accountNumber: string,
    public readonly ifscCode: string,
    public readonly branchName: string,
    public readonly passbookUrl: string,
    public readonly status: 'pending' | 'approved' | 'rejected',
    public readonly reason: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    providerId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    passbookUrl: string;
    status?: 'pending' | 'approved' | 'rejected';
    reason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ProviderBank {
    const now = new Date();
    return new ProviderBank(
      data.id,
      data.providerId,
      data.accountHolderName,
      data.bankName,
      data.accountNumber,
      data.ifscCode,
      data.branchName,
      data.passbookUrl,
      data.status || 'pending',
      data.reason || '',
      data.createdAt || now,
      data.updatedAt || now,
    );
  }
}
