import { ProviderServicesGroupedData } from "../../../domain/queries/provider/ProviderServicesQueryModel";
import { ProviderServicesGroupedByCategoryDto } from "../../dtos/provider/providerService/response/provider-services-grouped-by-category.dto";
import { toStringId } from "../../utils/id.utils";

export class ProviderServiceViewMapper {
  static toDto(
    doc: ProviderServicesGroupedData
  ): ProviderServicesGroupedByCategoryDto {
    return {
      category: {
        id: toStringId(doc.category.id),
        name: doc.category.name
      },
      services: doc.services.map((s) => ({
        providerServiceId: toStringId(s.providerServiceId),
        serviceId: toStringId(s.serviceId),
        serviceName: s.serviceName,
        mode: s.mode,
        maxHour: s.maxHour,
        price: s.price,
        dailyCapacity: s.dailyCapacity,
        status: s.status,
        isActive: s.isActive
      }))
    };
  }

  static toDtoList(
    docs: ProviderServicesGroupedData[]
  ): ProviderServicesGroupedByCategoryDto[] {
    return docs.map(this.toDto);
  }
}