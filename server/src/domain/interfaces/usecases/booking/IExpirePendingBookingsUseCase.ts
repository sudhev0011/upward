export interface IExpirePendingBookingsUseCase {
  execute(): Promise<void>;
}