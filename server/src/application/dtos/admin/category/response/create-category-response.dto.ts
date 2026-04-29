import { ServiceMode } from "../../../../../domain/entity.types";

export interface CreateCategoryReponseDto {
  id: string;
  name: string;
  description: string;
  mode: ServiceMode;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
