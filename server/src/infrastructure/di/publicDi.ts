import { PublicCategoryController } from "../../presentation/controllers/public/public-category.controller";
import { GetAllCategoriesUseCase } from "../../application/use-cases/admin/category/get-all-categories.use-case";
import { categoryRepository } from "./adminDi";
import { PublicServiceController } from "../../presentation/controllers/public/public-service.controller";
import { serviceRespository } from "./adminDi";
import { GetAllServicesUseCase } from "../../application/use-cases/service/get-all-servies.use-case";
import { GetServicesByCategoryUseCase } from "../../application/use-cases/service/get-services-by-category.use-case";
//useCases
export const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository)
const getAllServicesUseCase = new GetAllServicesUseCase(serviceRespository)
const getServicesByCategoryUseCase = new GetServicesByCategoryUseCase(serviceRespository)

//controllers
export const publicCategoryController = new PublicCategoryController(getAllCategoriesUseCase)
export const publicServiceController = new PublicServiceController(getAllServicesUseCase,getServicesByCategoryUseCase)