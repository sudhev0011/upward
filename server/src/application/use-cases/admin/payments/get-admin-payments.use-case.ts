import { IPaymentRepository } from "../../../../domain/interfaces/repositories/payment/IPaymentRepository";
import {
  AdminPaymentsResponse,
  IGetAdminPaymentsUseCase,
} from "../../../../domain/interfaces/usecases/admin/payments/IGetAdminPaymentsUseCase";

export class GetAdminPaymentsUseCase implements IGetAdminPaymentsUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(options: {
    page?: number;
    limit?: number;
    search?: string;
    transactionStatus?: string;
  }): Promise<AdminPaymentsResponse> {
    return this.paymentRepository.getPaymentsWithDetails(options);
  }
}
