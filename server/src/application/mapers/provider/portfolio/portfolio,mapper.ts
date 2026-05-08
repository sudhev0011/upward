import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import { PortfolioItemResponseDto } from "../../../dtos/provider/portfolio/portfolioResponse.dto";

export class PortfolioMapper {
  static toResponse(entity: PortfolioItem): PortfolioItemResponseDto {
    return {
      id:           entity.id!,
      providerId:   entity.providerId,
      title:        entity.title,
      description:  entity.description,
      images:       entity.images,
      thumbnailUrl: entity.thumbnailUrl,
      tags:         entity.tags,
      createdAt:    entity.createdAt,
      updatedAt:    entity.updatedAt,
    };
  }

  static toResponseList(entities: PortfolioItem[]): PortfolioItemResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }
}