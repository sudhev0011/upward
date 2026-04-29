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
import { SetProviderServicePriceUseCase } from "../../application/use-cases/provider/providerService/set-provider-service-price.use-case";
import { DeleteProviderServiceUseCase } from "../../application/use-cases/provider/providerService/delete-provider-service.use-case";

//repo init
const userRepository = new UserRepository(); 
const providerProfileRepository = new ProviderProfileRepository();
export const providerKycRepository = new ProviderKycRepository();
const providerBankRepository = new ProviderBankRepository();
const providerServiceRepository = new ProviderServiceRepository()

// service init
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);
const encryptionService = new EncryptionService();


// useCase init
const getProviderProfileUseCase = new GetProviderProfileUseCase(providerProfileRepository,userRepository);
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
const setProviderServicePriceUseCase = new SetProviderServicePriceUseCase(providerServiceRepository);
const deleteProviderServiceUseCase = new DeleteProviderServiceUseCase(providerServiceRepository)

// contrller init
export const providerProfileController = new ProviderProfileController(uploadAvatarUseCase,createProviderProfileUseCase,getProviderProfileUseCase,updateProviderProfileUseCase);
export const kycController = new KycController(submitProviderKycUseCase,saveProviderBankUseCase,getProviderKycUseCase,getProviderBankUseCase,uploadKycDocumentUseCase)
export const providerServiceController = new ProviderServiceController(createProviderServiceUseCase,getProviderServicesByCategoryUseCase,setProviderServicePriceUseCase, deleteProviderServiceUseCase)