export interface CommissionBreakdown {
  grossAmount: number;

  platformAmount: number;

  providerAmount: number;
}

export interface ICommissionCalculationService {
  calculate(
    grossAmount: number,
  ): CommissionBreakdown;
}