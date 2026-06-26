export interface IProcessProviderPayoutsUseCase {
  execute(): Promise<number>;
}