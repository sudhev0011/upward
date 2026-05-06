import { Types } from "mongoose";
import { AvailabilityOverride } from "../../../domain/entities/availability-override.entity";
import { AvailabilityOverrideDocument } from "../../persistence/mongodb/models/availability-override.model";

export class AvailabilityOverrideInfraMapper {
  static toEntity(doc: AvailabilityOverrideDocument): AvailabilityOverride {
    return AvailabilityOverride.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      date: doc.date,
      isWorking: doc.isWorking,
      startTime: doc.startTime ?? null,
      endTime: doc.endTime ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<AvailabilityOverride>
  ): Partial<AvailabilityOverrideDocument> {
    const doc: Partial<AvailabilityOverrideDocument> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.date !== undefined) doc.date = entity.date;
    if (entity.isWorking !== undefined) doc.isWorking = entity.isWorking;
    if (entity.startTime !== undefined) doc.startTime = entity.startTime;
    if (entity.endTime !== undefined) doc.endTime = entity.endTime;

    return doc;
  }
}