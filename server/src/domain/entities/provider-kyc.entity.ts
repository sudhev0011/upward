export class ProviderKyc {
  constructor(
    public readonly id: string,
    public readonly providerId: string,
    public readonly fullName: string,
    public readonly aadhaarNumber: string,
    public readonly dateOfBirth: Date,
    public readonly address: string,
    public readonly aadhaarFrontUrl: string,
    public readonly aadhaarBackUrl: string,
    public readonly status: 'pending' | 'approved' | 'rejected',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    providerId: string;
    fullName: string;
    aadhaarNumber: string;
    dateOfBirth: Date;
    address: string;
    aadhaarFrontUrl: string;
    aadhaarBackUrl: string;
    status?: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
  }): ProviderKyc {
    const now = new Date();
    return new ProviderKyc(
      data.id,
      data.providerId,
      data.fullName,
      data.aadhaarNumber,
      data.dateOfBirth,
      data.address,
      data.aadhaarFrontUrl,
      data.aadhaarBackUrl,
      data.status || 'pending',
      data.createdAt || now,
      data.updatedAt || now,
    );
  }
}
