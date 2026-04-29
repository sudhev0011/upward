import { Service } from "../../../domain/entities/service.entity";
import { ServiceDocument } from "../../persistence/mongodb/models/service.model";
import { Types } from "mongoose";

export class ServiceMapper {
  static toEntity(doc: ServiceDocument): Service {
    return Service.create({
      id: String(doc._id),
      categoryId: String(doc.categoryId),
      name: doc.name,
      description: doc.description || null,
      maxHour: doc.maxHour,
      mode: doc.mode,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  static toDocument(entity: Partial<Service>): Partial<ServiceDocument> {
    const doc: Partial<ServiceDocument> = {};

    if (entity.categoryId !== undefined)
      doc.categoryId = new Types.ObjectId(entity.categoryId);

    if (entity.name !== undefined) doc.name = entity.name;
    if (entity.description !== undefined) doc.description = entity.description;
    if (entity.maxHour !== undefined) doc.maxHour = entity.maxHour;
    if (entity.mode !== undefined) doc.mode = entity.mode;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;

    return doc;
  }
}