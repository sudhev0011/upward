import { CreateProviderProfileUseCase } from "../../application/use-cases/provider/profile/create-provider-profile.use-case";
import { GetProviderProfileUseCase } from "../../application/use-cases/provider/profile/get-provider-profile.use-case";
import { UpdateProviderProfileUseCase } from "../../application/use-cases/provider/profile/update-provider-profile.use-case";
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { UploadAvatarUseCase } from "../../application/use-cases/provider/media/upload-avatar.use-case";
import { ProviderProfileController } from "../../presentation/controllers/provider/profile/provider-profile.controller";
import { S3Service } from "../external-services/s3/s3.service";
import { WinstonLogger } from "../services/logger.service";
import { ProviderKycRepository } from "../persistence/mongodb/repositories/provider-kyc.repository";
import { ProviderBankRepository } from "../persistence/mongodb/repositories/provider-bank.repository";
import { SubmitProviderKycUseCase } from "../../application/use-cases/provider/kyc/submit-provider-kyc.use-case";
import { SaveProviderBankUseCase } from "../../application/use-cases/provider/kyc/save-provider-bank.use-case";
import { UploadKycDocumentUseCase } from "../../application/use-cases/provider/media/upload-kyc-document.use-case";
import { GetProviderKycUseCase } from "../../application/use-cases/provider/kyc/get-provider-kyc.use-case";
import { EncryptionService } from "../security/encryption-service";
import { GetProviderBankUseCase } from "../../application/use-cases/provider/kyc/get-provider-bank.use.case";
import { KycController } from "../../presentation/controllers/provider/kyc/kyc.controller";
import { ProviderServiceController } from "../../presentation/controllers/provider/providerService/provider-service.controller";
import { CreateProviderServiceUseCase } from "../../application/use-cases/provider/providerService/create-provider-service.use-case";
import { GetProviderServicesByCategoryUseCase } from "../../application/use-cases/provider/providerService/get-provider-services-by-category.use-case";
import { ProviderServiceRepository } from "../persistence/mongodb/repositories/provider-service.repository";
import { DeleteProviderServiceUseCase } from "../../application/use-cases/provider/providerService/delete-provider-service.use-case";
import { AvailabilityController } from "../../presentation/controllers/provider/availability/avaliability.controller";
import { SetAvailabilityUseCase } from "../../application/use-cases/provider/availability/setAvailability.use-case";
import { AvailabilityRepository } from "../persistence/mongodb/repositories/availability.repository";
import { GetAvailabilityUseCase } from "../../application/use-cases/provider/availability/getAvailability.use-case";
import { UnavailabilityController } from "../../presentation/controllers/provider/unavaliability/unavaliability.controller";
import { GetUnavailabilitiesUseCase } from "../../application/use-cases/provider/unavaialbility/get-unavailability.use-case";
import { UnavailabilityRepository } from "../persistence/mongodb/repositories/unavailability.repository";
import { CreateUnavailabilityUseCase } from "../../application/use-cases/provider/unavaialbility/create-unavailability.use-case";
import { DeleteUnavailabilityUseCase } from "../../application/use-cases/provider/unavaialbility/delete-unavaliability.use-case";
import { AvailabilityOverrideRepository } from "../persistence/mongodb/repositories/availability-override.repository";
import { SetAvailabilityOverrideUseCase } from "../../application/use-cases/provider/availability-override/set-availability-override.use-case";
import { GetAvailabilityOverridesUseCase } from "../../application/use-cases/provider/availability-override/get-avaliability-overrides.use-case";
import { DeleteAvailabilityOverrideUseCase } from "../../application/use-cases/provider/availability-override/delete-availability-overrides.use-case";
import { AvailabilityOverrideController } from "../../presentation/controllers/provider/avaliability-override/avaliability-override.controller";
import { PortfolioController } from "../../presentation/controllers/provider/portfolio/portfolio.controller";
import { GetUploadUrlUseCase } from "../../application/use-cases/provider/portfolio/getUploadUrl.use-case";
import { CreatePortfolioItemUseCase } from "../../application/use-cases/provider/portfolio/createPortfolioItem.use-case";
import { PortfolioRepository } from "../persistence/mongodb/repositories/portfolio.repository";
import { GetPortfolioUseCase } from "../../application/use-cases/provider/portfolio/getPortfolio.use-case";
import { DeletePortfolioItemUseCase } from "../../application/use-cases/provider/portfolio/deletePortfolioItem.use-case";
import { UpdatePortfolioItemUseCase } from "../../application/use-cases/provider/portfolio/updatePortfolioItem.use-case";
import { RemovePortfolioImageUseCase } from "../../application/use-cases/provider/portfolio/removePortfolioItem.use-case";
import { GetProvidersByCategoryUseCase } from "../../application/use-cases/provider/profile/get-providers-by-category.use-case";
import { serviceRespository, categoryRepository } from "./adminDi";
import { SlotController } from "../../presentation/controllers/provider/slot/slot.controller";
import { GetAvailableSlotsUseCase } from "../../application/use-cases/slot/get-available-slots.use-case";
import { WorkingHoursResolverService } from "../../application/services/working-hours-resolver.service";
import { UnavailabilityResolverService } from "../../application/services/unavailability-resolver.service";
import { ConfigureProviderServiceUseCase } from "../../application/use-cases/provider/providerService/set-provider-service-price.use-case";

//repo init
const userRepository = new UserRepository(); 
const providerProfileRepository = new ProviderProfileRepository();
export const providerKycRepository = new ProviderKycRepository();
const providerBankRepository = new ProviderBankRepository();
export const providerServiceRepository = new ProviderServiceRepository()
const avaliabilityRepository = new AvailabilityRepository()
const unavailabilityRepository = new UnavailabilityRepository()
const availabilityOverrideRepository = new AvailabilityOverrideRepository();
const portfolioRepository = new PortfolioRepository()

// service init
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);
const encryptionService = new EncryptionService();
const workingHoursResolver = new WorkingHoursResolverService(avaliabilityRepository, availabilityOverrideRepository)
const unavailabilityResolver = new UnavailabilityResolverService(unavailabilityRepository)

// useCase init
export const getProviderProfileUseCase = new GetProviderProfileUseCase(providerProfileRepository,userRepository);
const updateProviderProfileUseCase = new UpdateProviderProfileUseCase(providerProfileRepository,userRepository,s3Service,logger);
const createProviderProfileUseCase = new CreateProviderProfileUseCase(providerProfileRepository);
const uploadAvatarUseCase = new UploadAvatarUseCase(s3Service);

const submitProviderKycUseCase = new SubmitProviderKycUseCase(providerKycRepository, s3Service,encryptionService);
const saveProviderBankUseCase = new SaveProviderBankUseCase(providerBankRepository, s3Service,encryptionService);
const uploadKycDocumentUseCase = new UploadKycDocumentUseCase(s3Service);
export const getProviderKycUseCase = new GetProviderKycUseCase(providerKycRepository,s3Service,encryptionService);
const getProviderBankUseCase = new GetProviderBankUseCase(providerBankRepository,s3Service,encryptionService);
const createProviderServiceUseCase = new CreateProviderServiceUseCase(providerServiceRepository);
const getProviderServicesByCategoryUseCase = new GetProviderServicesByCategoryUseCase(userRepository,providerServiceRepository)
const configureProviderServiceUseCase = new ConfigureProviderServiceUseCase(providerServiceRepository, serviceRespository,providerProfileRepository,categoryRepository,logger);
const deleteProviderServiceUseCase = new DeleteProviderServiceUseCase(providerServiceRepository)
const setAvailabilityUseCase = new SetAvailabilityUseCase(avaliabilityRepository)
export const getAvailabilityUseCase = new GetAvailabilityUseCase(avaliabilityRepository)
export const getUnavailabilitiesUseCase = new GetUnavailabilitiesUseCase(unavailabilityRepository)
const createUnavailabilityUseCase = new CreateUnavailabilityUseCase(unavailabilityRepository,availabilityOverrideRepository)
const deleteUnavailabilityUseCase = new DeleteUnavailabilityUseCase(unavailabilityRepository)
const setAvailabilityOverrideUseCase = new SetAvailabilityOverrideUseCase(availabilityOverrideRepository,unavailabilityRepository);
export const getAvailabilityOverridesUseCase = new GetAvailabilityOverridesUseCase(availabilityOverrideRepository);
const deleteAvailabilityOverrideUseCase = new DeleteAvailabilityOverrideUseCase(availabilityOverrideRepository);

const getUploadUrlUseCase = new GetUploadUrlUseCase(s3Service)
const createPortfolioItemUseCase = new CreatePortfolioItemUseCase(portfolioRepository)
export const getPortfolioUseCase = new GetPortfolioUseCase(portfolioRepository)
const deletePortfolioItemUseCase = new DeletePortfolioItemUseCase(portfolioRepository, s3Service)
const updatePortfolioItemUseCase = new UpdatePortfolioItemUseCase(portfolioRepository)
const removePortfolioImageUseCase = new RemovePortfolioImageUseCase(portfolioRepository,s3Service)

const getProvidersByCategoryUseCase = new GetProvidersByCategoryUseCase(
  providerProfileRepository,
);

const getAvailableSlotsUseCase = new GetAvailableSlotsUseCase(providerServiceRepository,serviceRespository,categoryRepository,workingHoursResolver,unavailabilityResolver )

// contrller init
export const providerProfileController = new ProviderProfileController(uploadAvatarUseCase,createProviderProfileUseCase,getProviderProfileUseCase,updateProviderProfileUseCase, getProvidersByCategoryUseCase);
export const kycController = new KycController(submitProviderKycUseCase,saveProviderBankUseCase,getProviderKycUseCase,getProviderBankUseCase,uploadKycDocumentUseCase)
export const providerServiceController = new ProviderServiceController(createProviderServiceUseCase,getProviderServicesByCategoryUseCase,configureProviderServiceUseCase, deleteProviderServiceUseCase)

export const availabilityController = new AvailabilityController(setAvailabilityUseCase,getAvailabilityUseCase)
export const unavaliabilityController = new UnavailabilityController(createUnavailabilityUseCase, getUnavailabilitiesUseCase,deleteUnavailabilityUseCase)
export const availabilityOverrideController = new AvailabilityOverrideController(setAvailabilityOverrideUseCase, getAvailabilityOverridesUseCase, deleteAvailabilityOverrideUseCase);

export const portfolioController = new PortfolioController(getUploadUrlUseCase, createPortfolioItemUseCase, getPortfolioUseCase, updatePortfolioItemUseCase, removePortfolioImageUseCase, deletePortfolioItemUseCase);


export const slotController = new SlotController(getAvailableSlotsUseCase)