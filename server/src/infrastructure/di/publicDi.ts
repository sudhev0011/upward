import { PublicCategoryController } from "../../presentation/controllers/public/public-category.controller";
import { GetAllCategoriesUseCase } from "../../application/use-cases/admin/category/get-all-categories.use-case";
import { categoryRepository } from "./adminDi";
import { PublicServiceController } from "../../presentation/controllers/public/public-service.controller";
import { serviceRespository } from "./adminDi";
import { GetAllServicesUseCase } from "../../application/use-cases/service/get-all-servies.use-case";
import { GetServicesByCategoryUseCase } from "../../application/use-cases/service/get-services-by-category.use-case";
import { PublicPortfolioController } from "../../presentation/controllers/public/public-portfolio.controller";
import { getPortfolioUseCase } from "./provider.Di";
import { PublicAvailabilityController } from "../../presentation/controllers/public/public-availability.controller";
import { getAvailabilityUseCase } from "./provider.Di";
import { getAvailabilityOverridesUseCase } from "./provider.Di";
import { getUnavailabilitiesUseCase } from "./provider.Di";
import { getProviderProfileUseCase } from "./provider.Di";
import { PublicProviderProfileController } from "../../presentation/controllers/public/public-provider-profile.controller";
import { PublicProviderServiceController } from "../../presentation/controllers/public/public-provider-service.controller";
import { GetActiveProviderServicesUseCase } from "../../application/use-cases/provider/providerService/get-active-provider-services.use-case";
import { providerServiceRepository } from "./provider.Di";
//useCases
export const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
  categoryRepository,
);
const getAllServicesUseCase = new GetAllServicesUseCase(serviceRespository);
const getServicesByCategoryUseCase = new GetServicesByCategoryUseCase(
  serviceRespository,
);

const getActiveProviderServicesUseCase = new GetActiveProviderServicesUseCase(providerServiceRepository)

//controllers
export const publicCategoryController = new PublicCategoryController(
  getAllCategoriesUseCase,
);
export const publicServiceController = new PublicServiceController(
  getAllServicesUseCase,
  getServicesByCategoryUseCase,
);
export const publicPortfolioController = new PublicPortfolioController(
  getPortfolioUseCase,
);
export const publicAvailabilityController = new PublicAvailabilityController(
  getAvailabilityUseCase,
  getAvailabilityOverridesUseCase,
  getUnavailabilitiesUseCase,
);

export const publicProviderProfileController = new PublicProviderProfileController(getProviderProfileUseCase);

export const publicProviderServiceController = new PublicProviderServiceController(getActiveProviderServicesUseCase)

