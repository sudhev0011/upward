export interface IDeleteUnavailabilityUseCase {
  
  execute(id: string): Promise<void>;
}