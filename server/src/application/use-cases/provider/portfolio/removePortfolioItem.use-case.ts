import { NotFoundError } from "../../../../domain/errors/errors";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { IRemovePortfolioImageUseCase } from "../../../../domain/interfaces/usecases/portfolio/IRemovePorfolioImageUseCase";

export class RemovePortfolioImageUseCase implements IRemovePortfolioImageUseCase {
  constructor(
    private readonly _portfolioRepository: IPortfolioRepository,
    private readonly _s3Service: IS3Service
  ) {}
 
  async execute(id: string, providerId: string, imageUrl: string): Promise<void> {
    const existing = await this._portfolioRepository.findByIdAndProviderId(
      id,
      providerId
    );
 
    if (!existing) throw new NotFoundError("Portfolio item not found");
 
    const imageIndex = existing.images.indexOf(imageUrl);
    if (imageIndex === -1) throw new NotFoundError("Image not found in portfolio item");
 
    await this._s3Service.deleteFile(imageUrl);
 
    const updatedImages = existing.images.filter((_, i) => i !== imageIndex);
    const updatedStorageKeys = existing.storageKeys.filter((_, i) => i !== imageIndex);
 
    const thumbnailUrl = updatedImages[0] ?? null;
 
    await this._portfolioRepository.updateByIdAndProviderId(id, providerId, {
      images:      updatedImages,
      storageKeys: updatedStorageKeys,
      thumbnailUrl,
    });
  }
}