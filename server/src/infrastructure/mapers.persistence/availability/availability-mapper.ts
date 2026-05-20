import { Types } from "mongoose";
import {
  Availability,
  DaySchedule,
  WeeklySchedule,
} from "../../../domain/entities/availability.entity";
import { AvailabilityDocument } from "../../persistence/mongodb/models/availability.model";

export class AvailabilityInfraMapper {

  static mapToEntity(document: AvailabilityDocument): Availability {
    return Availability.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      timezone: document.timezone,
      availabilityWindow: document.availabilityWindow,
      weeklySchedule: this.mapWeeklyScheduleToEntity(document.weeklySchedule),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static mapToDocument(
    entity: Partial<Availability>,
  ): Partial<AvailabilityDocument> {
    const doc: Record<string, unknown> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.timezone !== undefined) doc.timezone = entity.timezone;
    if (entity.availabilityWindow !== undefined)
      doc.availabilityWindow = entity.availabilityWindow;
    if (entity.weeklySchedule !== undefined)
      doc.weeklySchedule = entity.weeklySchedule;

    return doc as Partial<AvailabilityDocument>;
  }

  static mapWeeklyScheduleToEntity(raw: WeeklySchedule): WeeklySchedule {
    const days: (keyof WeeklySchedule)[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    return days.reduce((acc, day) => {
      const d = raw[day] as DaySchedule;
      acc[day] = {
        isWorking: d.isWorking,
        startTime: d.startTime ?? null,
        endTime: d.endTime ?? null,
      };
      return acc;
    }, {} as WeeklySchedule);
  }
}
