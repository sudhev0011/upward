export interface SlotValidationResult {
  valid: boolean;

  providerId: string;

  serviceId: string;

  startDateTime: Date;

  endDateTime: Date;

  totalAmount: number;
}