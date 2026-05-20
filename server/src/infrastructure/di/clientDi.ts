// controller import
import { ClientProfileController } from "../../presentation/controllers/client/profile/client-profile.controller";

//useCase import 
import { CreateClientProfileUseCase } from "../../application/use-cases/client/profile/create-client-profile.use-case";
import { GetClientProfileUseCase } from "../../application/use-cases/client/profile/get-client-profile.use-case";
import { UpdateClientProfileUseCase } from "../../application/use-cases/client/profile/update-client-profile.use-case";
import { UploadAvatarUseCase } from "../../application/use-cases/client/media/upload-avatar.use-case";

// repository import
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";

//service import
import { S3Service } from "../external-services/s3/s3.service";
import { WinstonLogger } from "../services/logger.service";
import { BookingController } from "../../presentation/controllers/client/booking/booking.controller";
import { CreateBookingUseCase } from "../../application/use-cases/booking/create-booking.use-case";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { UnavailabilityRepository } from "../persistence/mongodb/repositories/unavailability.repository";
import { SlotValidationService } from "../../application/services/slot-validation.service";
import { ProviderServiceRepository } from "../persistence/mongodb/repositories/provider-service.repository";
import { ServiceRepository } from "../persistence/mongodb/repositories/service.repository";
import { CategoryRepository } from "../persistence/mongodb/repositories/category.repository";
import { WorkingHoursResolverService } from "../../application/services/working-hours-resolver.service";
import { AvailabilityRepository } from "../persistence/mongodb/repositories/availability.repository";
import { AvailabilityOverride } from "../../domain/entities/availability-override.entity";
import { AvailabilityOverrideRepository } from "../persistence/mongodb/repositories/availability-override.repository";
import { UnavailabilityResolverService } from "../../application/services/unavailability-resolver.service";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";




// repository init
const clientProfileRepository = new ClientProfileRepository()
const userRepository = new UserRepository()
const availabilityRepository = new AvailabilityRepository()
const availabilityOverrideRepository = new AvailabilityOverrideRepository()
const bookingRepository = new BookingRepository()
const unavailabilityRepository = new UnavailabilityRepository()
const providerServiceRepository = new ProviderServiceRepository()
const serviceRepository = new ServiceRepository()
const categoryRepository = new CategoryRepository()
const unavailabilityResolver = new UnavailabilityResolverService(unavailabilityRepository)
const mongoTransactionManager = new MongoTransactionManager()

// service init

const logger = new WinstonLogger();
const s3Service = new S3Service(logger);
const workingHoursResolverService = new WorkingHoursResolverService(availabilityRepository,availabilityOverrideRepository)
const slotValidationService = new SlotValidationService(providerServiceRepository, serviceRepository, categoryRepository, bookingRepository, workingHoursResolverService, unavailabilityResolver)

//useCase init
const createClientProfileUseCase = new CreateClientProfileUseCase(clientProfileRepository)
export const getClientProfileUseCase = new GetClientProfileUseCase(clientProfileRepository,userRepository)
const updateClientProfileUseCase = new UpdateClientProfileUseCase(clientProfileRepository,userRepository,s3Service,logger)
const uploadAvatarUseCase = new UploadAvatarUseCase(s3Service)

const createBookingUseCase = new CreateBookingUseCase(bookingRepository,unavailabilityRepository,slotValidationService,mongoTransactionManager)

// controller inint
export const clientProfileController = new ClientProfileController(uploadAvatarUseCase,createClientProfileUseCase,getClientProfileUseCase,updateClientProfileUseCase)

export const bookingController = new BookingController(createBookingUseCase)