export interface IDeletePortfolioItemUseCase {
  execute(id: string, providerId: string): Promise<void>;
}