export interface IProcessProviderPayoutsUseCase {
  execute(): Promise<Number>;
}