import { IWalletRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { ICommissionCalculationService } from "../../../../domain/interfaces/services/payment/ICommissionCalculationService";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { WalletTransactionType } from "../../../../domain/enums/wallet-transaction.type.enum";
import { WalletTransactionCategory } from "../../../../domain/enums/wallet-transaction-category.enum";
import { IGetProviderPayoutsUseCase } from "../../../../domain/interfaces/usecases/provider/payout/IGetProviderPayoutsUseCase";

export interface PayoutTransactionDto {
  id: string;
  amount: number;
  type: WalletTransactionType;
  category: WalletTransactionCategory;
  description: string;
  bookingId: string | null;
  createdAt: Date;
}

export interface ProviderPayoutsResponse {
  balance: number;
  totalEarned: number;
  pendingAmount: number;
  transactions: PayoutTransactionDto[];
}

export class GetProviderPayoutsUseCase implements IGetProviderPayoutsUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly walletTransactionRepository: IWalletTransactionRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly commissionCalculationService: ICommissionCalculationService
  ) {}

  async execute(providerId: string): Promise<ProviderPayoutsResponse> {
    // 1. Get or create wallet
    let wallet = await this.walletRepository.findByUserId(providerId);
    if (!wallet) {
      wallet = await this.walletRepository.create(
        Wallet.create({ userId: providerId, balance: 0 })
      );
    }

    // 2. Fetch wallet transactions
    const transactions = await this.walletTransactionRepository.findByWalletId(
      wallet.id!
    );

    // 3. Map transactions
    const mappedTransactions: PayoutTransactionDto[] = transactions.map((t) => ({
      id: t.id!,
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description,
      bookingId: t.bookingId,
      createdAt: t.createdAt,
    }));

    // Sort descending by date
    mappedTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // 4. Calculate Total Earned (sum of CREDIT transactions)
    const totalEarned = transactions
      .filter((t) => t.type === WalletTransactionType.CREDIT)
      .reduce((sum, t) => sum + t.amount, 0);

    // 5. Calculate Pending Amount from active bookings
    const activeBookings = await this.bookingRepository.findPendingPayoutBookings(
      providerId
    );

    const pendingAmount = activeBookings.reduce((sum, booking) => {
      const breakdown = this.commissionCalculationService.calculate(
        booking.totalAmount
      );
      return sum + breakdown.providerAmount;
    }, 0);

    return {
      balance: wallet.balance,
      totalEarned,
      pendingAmount,
      transactions: mappedTransactions,
    };
  }
}
