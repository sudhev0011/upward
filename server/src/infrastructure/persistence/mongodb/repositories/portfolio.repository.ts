import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { PortfolioItem } from "../../../../domain/entities/portfolio.entity";
import {
  PortfolioItemModel,
  PortfolioItemDocument,
} from "../models/portfolio.model";
import { IPortfolioRepository } from "../../../../domain/interfaces/repositories/portfolio/IPortfolioRepository";

export class PortfolioRepository
  extends RepositoryBase<PortfolioItem, PortfolioItemDocument>
  implements IPortfolioRepository
{
  constructor() {
    super(PortfolioItemModel);
  }

  async findByProviderId(providerId: string): Promise<PortfolioItem[]> {
    const documents = await this.model
      .find({ providerId: new Types.ObjectId(providerId) })
      .sort({ createdAt: -1 });

    return documents.map((doc) => this.mapToEntity(doc));
  }

  async findByIdAndProviderId(
    id: string,
    providerId: string
  ): Promise<PortfolioItem | null> {
    const document = await this.model.findOne({
      _id: new Types.ObjectId(id),
      providerId: new Types.ObjectId(providerId),
    });

    return document ? this.mapToEntity(document) : null;
  }

  async updateByIdAndProviderId(
    id: string,
    providerId: string,
    data: Partial<PortfolioItem>
  ): Promise<PortfolioItem | null> {
    const documentData = this.mapToDocument(data);

    const document = await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        providerId: new Types.ObjectId(providerId),
      },
      { ...documentData, updatedAt: new Date() },
      { new: true }
    );

    return document ? this.mapToEntity(document) : null;
  }

  async deleteByIdAndProviderId(
    id: string,
    providerId: string
  ): Promise<boolean> {
    const result = await this.model.deleteOne({
      _id: new Types.ObjectId(id),
      providerId: new Types.ObjectId(providerId),
    });

    return result.deletedCount > 0;
  }

  // ─── Mappers ───────────────────────────────────────────────────────────────

  protected mapToEntity(document: PortfolioItemDocument): PortfolioItem {
    return PortfolioItem.create({
      id:           document._id.toString(),
      providerId:   document.providerId.toString(),
      title:        document.title,
      description:  document.description,
      images:       document.images,
      storageKeys:  document.storageKeys,
      thumbnailUrl: document.thumbnailUrl,
      tags:         document.tags,
      createdAt:    document.createdAt,
      updatedAt:    document.updatedAt,
    });
  }

  protected mapToDocument(
    entity: Partial<PortfolioItem>
  ): Partial<PortfolioItemDocument> {
    const doc: Record<string, unknown> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.title !== undefined)
      doc.title = entity.title;
    if (entity.description !== undefined)
      doc.description = entity.description;
    if (entity.images !== undefined)
      doc.images = entity.images;
    if (entity.storageKeys !== undefined)
      doc.storageKeys = entity.storageKeys;
    if (entity.thumbnailUrl !== undefined)
      doc.thumbnailUrl = entity.thumbnailUrl;
    if (entity.tags !== undefined)
      doc.tags = entity.tags;

    return doc as Partial<PortfolioItemDocument>;
  }
}