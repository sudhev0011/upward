import { Types } from "mongoose";
import { PortfolioItem } from "../../../domain/entities/portfolio.entity";
import { PortfolioItemDocument } from "../../persistence/mongodb/models/portfolio.model";

export class PortfolioMapper{

    static mapToEntity(document: PortfolioItemDocument): PortfolioItem {
        return PortfolioItem.create({
          id: document._id.toString(),
          providerId: document.providerId.toString(),
          title: document.title,
          description: document.description,
          images: document.images,
          storageKeys: document.storageKeys,
          thumbnailUrl: document.thumbnailUrl,
          tags: document.tags,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        });
      }
    
      static mapToDocument(
        entity: Partial<PortfolioItem>,
      ): Partial<PortfolioItemDocument> {
        const doc: Record<string, unknown> = {};
    
        if (entity.providerId !== undefined)
          doc.providerId = new Types.ObjectId(entity.providerId);
        if (entity.title !== undefined) doc.title = entity.title;
        if (entity.description !== undefined) doc.description = entity.description;
        if (entity.images !== undefined) doc.images = entity.images;
        if (entity.storageKeys !== undefined) doc.storageKeys = entity.storageKeys;
        if (entity.thumbnailUrl !== undefined)
          doc.thumbnailUrl = entity.thumbnailUrl;
        if (entity.tags !== undefined) doc.tags = entity.tags;
    
        return doc as Partial<PortfolioItemDocument>;
      }
}