import { Types } from "mongoose";
import { AvailabilityOverride } from "../../../domain/entities/availability-override.entity";
import { AvailabilityOverrideDocument } from "../../persistence/mongodb/models/availability-override.model";

export class AvailabilityOverrideInfraMapper {
  static mapToEntity(
    document: AvailabilityOverrideDocument
  ): AvailabilityOverride {
    return AvailabilityOverride.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      date: document.date,
      isWorking: document.isWorking,
      startTime: document.startTime ?? null,
      endTime: document.endTime ?? null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static mapToDocument(
    entity: Partial<AvailabilityOverride>
  ): Partial<AvailabilityOverrideDocument> {
    const doc: Partial<AvailabilityOverrideDocument> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.date !== undefined) doc.date = entity.date;
    if (entity.isWorking !== undefined) doc.isWorking = entity.isWorking;
    if (entity.startTime !== undefined) doc.startTime = entity.startTime;
    if (entity.endTime !== undefined) doc.endTime = entity.endTime;

    return doc as Partial<AvailabilityOverrideDocument>;
  }
}