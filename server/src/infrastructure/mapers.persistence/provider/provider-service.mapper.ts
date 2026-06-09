import { Types } from "mongoose";
import { ProviderService } from "../../../domain/entities/provider-service.entity";
import { ProviderServiceDocument } from "../../persistence/mongodb/models/provider-service.model";

export class ProviderServiceMapper {
  static toEntity(doc: ProviderServiceDocument): ProviderService {
    return ProviderService.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      serviceId: doc.serviceId.toString(),
      price: doc.price,
      dailyCapacity: doc.dailyCapacity,
      status: doc.status,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<ProviderService>): Partial<ProviderServiceDocument> {
    const doc: Partial<ProviderServiceDocument> = {};

    if (entity.providerId)
      doc.providerId = new Types.ObjectId(entity.providerId);

    if (entity.serviceId) doc.serviceId = new Types.ObjectId(entity.serviceId);

    if (entity.price !== undefined) doc.price = entity.price;
    if (entity.dailyCapacity !== undefined) doc.dailyCapacity = entity.dailyCapacity;
    if (entity.status !== undefined) doc.status = entity.status;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;

    return doc;
  }
}
