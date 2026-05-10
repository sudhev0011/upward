import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import {
  PortfolioItemResponseDto,
  PortfolioPageResponseDto,
} from "../../../dtos/provider/portfolio/portfolioResponse.dto";

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

  static toPageResponse(
    entities: PortfolioItem[],
    totalCount: number,
    page: number,
    limit: number
  ): PortfolioPageResponseDto {
    return {
      items:       entities.map((e) => this.toResponse(e)),
      totalCount,
      page,
      limit,
      hasNextPage: page * limit < totalCount,
    };
  }
}