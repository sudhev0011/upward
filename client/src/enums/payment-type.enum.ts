export const PaymentType = {
  FULL: "full",
  PARTIAL: "partial",
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];