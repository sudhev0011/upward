import { BlockClientUseCase } from "../../application/use-cases/admin/client/block-client.use-case";
import { GetAllClientsUseCase } from "../../application/use-cases/admin/client/get-all-clients.use-case";
import { AdminGetClientByIdUseCase } from "../../application/use-cases/admin/client/get-client-by-id.use-case";
import { AdminClientController } from "../../presentation/controllers/admin/admin-client.controller";
import { S3Service } from "../external-services/s3/s3.service";
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { WinstonLogger } from "../services/logger.service";
import { getClientProfileUseCase } from "./clientDi";

// Provider imports
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { GetAllProvidersUseCase } from "../../application/use-cases/admin/provider/get-all-providers.use-case";
import { AdminGetProviderByIdUseCase as ProviderGetByIdUseCase } from "../../application/use-cases/admin/provider/get-provider-by-id.use-case";
import { ApproveProviderUseCase } from "../../application/use-cases/admin/provider/approve-provider.use-case";
import { AdminProviderController } from "../../presentation/controllers/admin/admin-provider.controller";
import { BlockProviderUseCase } from "../../application/use-cases/admin/provider/block-provider.use-case";
import { RejectProviderUseCase } from "../../application/use-cases/admin/provider/reject-provider.use-case";
import { getProviderKycUseCase, providerKycRepository } from "./provider.Di";


// repo init
const userRepository = new UserRepository();
const clientProfileRepository = new ClientProfileRepository()
const providerProfileRepository = new ProviderProfileRepository()

// service
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);

// useCase init
const getAllUsersUseCase = new GetAllClientsUseCase(userRepository,clientProfileRepository,s3Service)
const blockUserUseCase = new BlockClientUseCase(userRepository)
const adminGetUserByIdUseCase = new AdminGetClientByIdUseCase(userRepository,getClientProfileUseCase); 

const getAllProvidersUseCase = new GetAllProvidersUseCase(providerProfileRepository);
const adminGetProviderByIdUseCase = new ProviderGetByIdUseCase(userRepository, providerProfileRepository);
const approveProviderUseCase = new ApproveProviderUseCase(providerProfileRepository,providerKycRepository);
const rejectProviderUseCase = new RejectProviderUseCase(providerKycRepository,providerProfileRepository)
const blockProviderUseCase = new BlockProviderUseCase(userRepository)

// cntrl init
export const adminClientController = new AdminClientController(getAllUsersUseCase,adminGetUserByIdUseCase,blockUserUseCase,)
export const adminProviderController = new AdminProviderController(getAllProvidersUseCase, adminGetProviderByIdUseCase, approveProviderUseCase,rejectProviderUseCase, blockProviderUseCase, getProviderKycUseCase);