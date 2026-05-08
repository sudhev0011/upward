import { NotFoundError } from "../../../../domain/errors/errors";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { IDeletePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/IDeletePortfolioItemUseCase";

export class DeletePortfolioItemUseCase implements IDeletePortfolioItemUseCase {
  constructor(
    private readonly _portfolioRepository: IPortfolioRepository,
    private readonly _s3Service: IS3Service
  ) {}
 
  async execute(id: string, providerId: string): Promise<void> {
    const item = await this._portfolioRepository.findByIdAndProviderId(
      id,
      providerId
    );
 
    if (!item) {
      throw new NotFoundError("Portfolio item not found");
    }
 
    // Delete all images from S3
    await Promise.all(item.images.map((url) => this._s3Service.deleteFile(url)));
 
    await this._portfolioRepository.deleteByIdAndProviderId(id, providerId);
  }
}