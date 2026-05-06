import { Types } from "mongoose";
import {
  Availability,
  WeeklySchedule,
} from "../../../domain/entities/availability.entity";
import { AvailabilityDocument } from "../../persistence/mongodb/models/availability.model";

export class AvailabilityInfraMapper {
  static toEntity(doc: AvailabilityDocument): Availability {
    return Availability.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      timezone: doc.timezone,
      availabilityWindow: doc.availabilityWindow,
      weeklySchedule: doc.weeklySchedule as WeeklySchedule,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<Availability>
  ): Partial<AvailabilityDocument> {
    const doc: Partial<AvailabilityDocument> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.timezone !== undefined) doc.timezone = entity.timezone;
    if (entity.availabilityWindow !== undefined)
      doc.availabilityWindow = entity.availabilityWindow;
    if (entity.weeklySchedule !== undefined)
      doc.weeklySchedule = entity.weeklySchedule;

    return doc;
  }
}