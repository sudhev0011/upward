import { BlockUserUseCase } from "../../application/use-cases/admin/user/block-user.use-case";
import { GetAllUsersUseCase } from "../../application/use-cases/admin/user/get-all-users.use-case";
import { AdminGetUserByIdUseCase } from "../../application/use-cases/admin/user/get-user-by-id.use-case";
import { GetClientProfileUseCase } from "../../application/use-cases/client/profile/get-client-profile.use-case";
import { AdminUserController } from "../../presentation/controllers/admin/admin-user.controller";
import { S3Service } from "../external-services/s3/s3.service";
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { WinstonLogger } from "../services/logger.service";
import { getClientProfileUseCase } from "./clientDi";


// repo init
const userRepository = new UserRepository();
const clientProfileRepository = new ClientProfileRepository()

// service
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);

// useCase init
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository,clientProfileRepository,s3Service)
const blockUserUseCase = new BlockUserUseCase(userRepository)
const adminGetUserByIdUseCase = new AdminGetUserByIdUseCase(userRepository,getClientProfileUseCase); 

// cntrl init
export const adminUserController = new AdminUserController(getAllUsersUseCase,adminGetUserByIdUseCase,blockUserUseCase,)