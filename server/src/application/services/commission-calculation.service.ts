import {
  CommissionBreakdown,
  ICommissionCalculationService,
} from "../../domain/interfaces/services/payment/ICommissionCalculationService";

export class CommissionCalculationService implements ICommissionCalculationService {
  private static readonly PLATFORM_COMMISSION_PERCENTAGE = 20;

  calculate(grossAmount: number): CommissionBreakdown {
    const platformAmount = Math.round(
      (grossAmount *
        CommissionCalculationService.PLATFORM_COMMISSION_PERCENTAGE) /
        100,
    );

    const providerAmount = grossAmount - platformAmount;

    return {
      grossAmount,

      platformAmount,

      providerAmount,
    };
  }
}
