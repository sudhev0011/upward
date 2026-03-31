// controller import
import { CreateClientProfileController } from "../../presentation/controllers/client/profile/create-client-profile.controller";
import { GetClientProfileController } from "../../presentation/controllers/client/profile/get-client-profile.controller";
import { UpdateClientProfileController } from "../../presentation/controllers/client/profile/update-client-profile.controller";

//useCase import 
import { CreateClientProfileUseCase } from "../../application/use-cases/client/profile/create-client-profile.use-case";
import { GetClientProfileUseCase } from "../../application/use-cases/client/profile/get-client-profile.use-case";
import { UpdateClientProfileUseCase } from "../../application/use-cases/client/profile/update-client-profile.use-case";
import { UploadAvatarUseCase } from "../../application/use-cases/client/media/upload-avatar.use-case";

// repository import
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { ClientProfileController } from "../../presentation/controllers/client/profile/client-profile.controller";

//service import
import { S3Service } from "../external-services/s3/s3.service";
import { WinstonLogger } from "../services/logger.service";





// repository init
const clientProfileRepository = new ClientProfileRepository()
const userRepository = new UserRepository()

// service init

const logger = new WinstonLogger();
const s3Service = new S3Service(logger);

//useCase init
const createClientProfileUseCase = new CreateClientProfileUseCase(clientProfileRepository)
export const getClientProfileUseCase = new GetClientProfileUseCase(clientProfileRepository,userRepository)
const updateClientProfileUseCase = new UpdateClientProfileUseCase(clientProfileRepository,userRepository,s3Service,logger)
const uploadAvatarUseCase = new UploadAvatarUseCase(s3Service)

// controller inint
export const createClientProfileController = new CreateClientProfileController(createClientProfileUseCase)
export const getClientProfileController = new GetClientProfileController(getClientProfileUseCase)
export const updateClientProfileController = new UpdateClientProfileController(updateClientProfileUseCase)
export const clientProfileController = new ClientProfileController(uploadAvatarUseCase)