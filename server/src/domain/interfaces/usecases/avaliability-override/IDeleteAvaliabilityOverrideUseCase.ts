export interface IDeleteAvailabilityOverrideUseCase {
 
  execute(providerId: string, date: string): Promise<void>;
}