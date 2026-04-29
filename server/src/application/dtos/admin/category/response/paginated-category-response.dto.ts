import { CreateCategoryReponseDto } from "./create-category-response.dto";

export interface GetCategoriesResponseDto {
  data: CreateCategoryReponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
