import { BlockClientUseCase } from "../../application/use-cases/admin/client/block-client.use-case";
import { GetAllClientsUseCase } from "../../application/use-cases/admin/client/get-all-clients.use-case";
import { AdminGetClientByIdUseCase } from "../../application/use-cases/admin/client/get-client-by-id.use-case";
import { AdminClientController } from "../../presentation/controllers/admin/admin-client.controller";
import { GetAdminDashboardStatsUseCase } from "../../application/use-cases/admin/dashboard/get-admin-dashboard-stats.use-case";
import { AdminDashboardController } from "../../presentation/controllers/admin/dashboard/admin-dashboard.controller";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { S3Service } from "../external-services/s3/s3.service";
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { WinstonLogger } from "../services/logger.service";
import { getClientProfileUseCase } from "./clientDi";
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { GetAllProvidersUseCase } from "../../application/use-cases/admin/provider/get-all-providers.use-case";
import { AdminGetProviderByIdUseCase as ProviderGetByIdUseCase } from "../../application/use-cases/admin/provider/get-provider-by-id.use-case";
import { ApproveProviderUseCase } from "../../application/use-cases/admin/provider/approve-provider.use-case";
import { AdminProviderController } from "../../presentation/controllers/admin/admin-provider.controller";
import { BlockProviderUseCase } from "../../application/use-cases/admin/provider/block-provider.use-case";
import { RejectProviderUseCase } from "../../application/use-cases/admin/provider/reject-provider.use-case";
import { ApproveProviderBankUseCase } from "../../application/use-cases/admin/provider/approve-provider-bank.use-case";
import { PayoutRequestRepository } from "../persistence/mongodb/repositories/payout-request.repository";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { GetAdminPayoutRequestsUseCase } from "../../application/use-cases/admin/payout/get-admin-payout-requests.use-case";
import { ProcessPayoutRequestUseCase } from "../../application/use-cases/admin/payout/process-payout-request.use-case";
import { AdminPayoutController } from "../../presentation/controllers/admin/payout/admin-payout.controller";
import { walletRepository, walletTransactionRepository } from "./clientDi";
import { AdminCategoryController } from "../../presentation/controllers/admin/admin-category.controller";
import { CreateCategoryUseCase } from "../../application/use-cases/admin/category/create-category.use-case";
import { CategoryRepository } from "../persistence/mongodb/repositories/category.repository";
import { AdminServiceController } from "../../presentation/controllers/admin/admin-service.controller";
import { CreateServiceUseCase } from "../../application/use-cases/service/create-service.use-case";
import { ServiceRepository } from "../persistence/mongodb/repositories/service.repository";
import { DeleteServiceUseCase } from "../../application/use-cases/service/delete-service.use-case";
import { GetAllCategoriesUseCase } from "../../application/use-cases/admin/category/get-all-categories.use-case";
import { GetAllServicesUseCase } from "../../application/use-cases/service/get-all-servies.use-case";
import { GetAllCategoriesWithPaginationUseCase } from "../../application/use-cases/admin/category/get-all-categories-with-pagination.use-case";
import { UpdateCategoryUseCase } from "../../application/use-cases/admin/category/update-category-use.case";
import { GetAllServicesWithPaginationUseCase } from "../../application/use-cases/service/get-all-services-with-pagination.use-case";
import { ToggleServiceUseCase } from "../../application/use-cases/service/toggle-service.use-case";
import { UpdateServiceUseCase } from "../../application/use-cases/service/update-service.use-case";
import { PaymentRepository } from "../persistence/mongodb/repositories/payment.repository";
import { GetAdminPaymentsUseCase } from "../../application/use-cases/admin/payments/get-admin-payments.use-case";
import { AdminPaymentController } from "../../presentation/controllers/admin/admin-payment.controller";
import { GetProviderKycUseCase } from "../../application/use-cases/provider/kyc/get-provider-kyc.use-case";
import { GetProviderBankUseCase } from "../../application/use-cases/provider/kyc/get-provider-bank.use.case";
import { EncryptionService } from "../security/encryption-service";
import { ProviderKycRepository } from "../persistence/mongodb/repositories/provider-kyc.repository";
import { ProviderBankRepository } from "../persistence/mongodb/repositories/provider-bank.repository";

const userRepository = new UserRepository();
const clientProfileRepository = new ClientProfileRepository()
const providerProfileRepository = new ProviderProfileRepository()
export const categoryRepository = new CategoryRepository()
export const serviceRespository = new ServiceRepository();
const providerKycRepository = new ProviderKycRepository();
const providerBankRepository = new ProviderBankRepository();

// service
const logger = new WinstonLogger();
const s3Service = new S3Service(logger);
const encryptionService = new EncryptionService();

// useCase init
const getAllUsersUseCase = new GetAllClientsUseCase(userRepository,clientProfileRepository,s3Service)
const blockUserUseCase = new BlockClientUseCase(userRepository)
const adminGetUserByIdUseCase = new AdminGetClientByIdUseCase(userRepository,getClientProfileUseCase); 
export const getProviderKycUseCase = new GetProviderKycUseCase(providerKycRepository,s3Service,encryptionService);
export const getProviderBankUseCase = new GetProviderBankUseCase(providerBankRepository,s3Service,encryptionService);

const getAllProvidersUseCase = new GetAllProvidersUseCase(providerProfileRepository);
const adminGetProviderByIdUseCase = new ProviderGetByIdUseCase(userRepository, providerProfileRepository);
const approveProviderUseCase = new ApproveProviderUseCase(providerProfileRepository,providerKycRepository);
const rejectProviderUseCase = new RejectProviderUseCase(providerKycRepository,providerProfileRepository)
const blockProviderUseCase = new BlockProviderUseCase(userRepository)
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
const createServiceUseCase = new CreateServiceUseCase(serviceRespository)
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRespository,userRepository)
const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository)
const getAllServicesUseCase = new GetAllServicesUseCase(serviceRespository)
const getAllCategoriesWithPaginationUseCase = new GetAllCategoriesWithPaginationUseCase(categoryRepository)
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
const getAllServicesWithPagination = new GetAllServicesWithPaginationUseCase(serviceRespository);
const toggleServiceUseCase = new ToggleServiceUseCase(serviceRespository);
const updateServiceUseCase = new UpdateServiceUseCase(serviceRespository)


// cntrl init
const approveProviderBankUseCase = new ApproveProviderBankUseCase(providerBankRepository);

export const adminClientController = new AdminClientController(getAllUsersUseCase,adminGetUserByIdUseCase,blockUserUseCase,)
export const adminProviderController = new AdminProviderController(
  getAllProvidersUseCase,
  adminGetProviderByIdUseCase,
  approveProviderUseCase,
  rejectProviderUseCase,
  blockProviderUseCase,
  getProviderKycUseCase,
  getProviderBankUseCase,
  approveProviderBankUseCase
);
export const adminCategoryController = new AdminCategoryController(createCategoryUseCase,getAllCategoriesUseCase, getAllCategoriesWithPaginationUseCase, updateCategoryUseCase)
export const adminServiceController = new AdminServiceController(createServiceUseCase,deleteServiceUseCase,getAllServicesUseCase, getAllServicesWithPagination, toggleServiceUseCase, updateServiceUseCase)

const bookingRepository = new BookingRepository();
const getAdminDashboardStatsUseCase = new GetAdminDashboardStatsUseCase(bookingRepository);
export const adminDashboardController = new AdminDashboardController(getAdminDashboardStatsUseCase);

const paymentRepository = new PaymentRepository();
const getAdminPaymentsUseCase = new GetAdminPaymentsUseCase(paymentRepository);
export const adminPaymentController = new AdminPaymentController(getAdminPaymentsUseCase);

const payoutRequestRepository = new PayoutRequestRepository();
const mongoTransactionManager = new MongoTransactionManager();
const getAdminPayoutRequestsUseCase = new GetAdminPayoutRequestsUseCase(
  payoutRequestRepository,
  userRepository,
  providerBankRepository
);
const processPayoutRequestUseCase = new ProcessPayoutRequestUseCase(
  payoutRequestRepository,
  walletRepository,
  walletTransactionRepository,
  mongoTransactionManager
);
export const adminPayoutController = new AdminPayoutController(
  getAdminPayoutRequestsUseCase,
  processPayoutRequestUseCase
);