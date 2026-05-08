export interface IRemovePortfolioImageUseCase {
  execute(id: string, providerId: string, imageUrl: string): Promise<void>;
}