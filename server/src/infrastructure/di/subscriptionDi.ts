import { SubscriptionPlanRepository } from "../persistence/mongodb/repositories/subscription-plan.repository";
import { ProviderSubscriptionRepository } from "../persistence/mongodb/repositories/provider-subscription.repository";
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { StripeService } from "../external-services/stripe/stripe.service";

// Use Cases
import { CreateSubscriptionPlanUseCase } from "../../application/use-cases/admin/subscription-plan/create-subscription-plan.use-case";
import { UpdateSubscriptionPlanUseCase } from "../../application/use-cases/admin/subscription-plan/update-subscription-plan.use-case";
import { DeleteSubscriptionPlanUseCase } from "../../application/use-cases/admin/subscription-plan/delete-subscription-plan.use-case";
import { GetAllSubscriptionPlansUseCase } from "../../application/use-cases/admin/subscription-plan/get-all-subscription-plans.use-case";
import { GetActivePlansUseCase } from "../../application/use-cases/provider/subscription/get-active-plans.use-case";
import { CreateSubscriptionCheckoutUseCase } from "../../application/use-cases/provider/subscription/create-subscription-checkout.use-case";
import { ConfirmSubscriptionPaymentUseCase } from "../../application/use-cases/provider/subscription/confirm-subscription-payment.use-case";

import { SubscriptionController } from "../../presentation/controllers/subscription/subscription.controller";

// Repositories
export const subscriptionPlanRepository = new SubscriptionPlanRepository();
export const providerSubscriptionRepository = new ProviderSubscriptionRepository();
export const providerProfileRepository = new ProviderProfileRepository();
export const userRepository = new UserRepository();

// Transaction Manager & Stripe
export const transactionManager = new MongoTransactionManager();
export const stripeService = new StripeService();

// Admin Use Cases
const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(
  subscriptionPlanRepository,
);
const updateSubscriptionPlanUseCase = new UpdateSubscriptionPlanUseCase(
  subscriptionPlanRepository,
);
const deleteSubscriptionPlanUseCase = new DeleteSubscriptionPlanUseCase(
  subscriptionPlanRepository,
);
const getAllSubscriptionPlansUseCase = new GetAllSubscriptionPlansUseCase(
  subscriptionPlanRepository,
);

// Provider Use Cases
const getActivePlansUseCase = new GetActivePlansUseCase(
  subscriptionPlanRepository,
);
const createSubscriptionCheckoutUseCase = new CreateSubscriptionCheckoutUseCase(
  subscriptionPlanRepository,
  providerSubscriptionRepository,
  stripeService,
);
export const confirmSubscriptionPaymentUseCase = new ConfirmSubscriptionPaymentUseCase(
  subscriptionPlanRepository,
  providerSubscriptionRepository,
  providerProfileRepository,
  transactionManager,
);

// Controller Singleton
export const subscriptionController = new SubscriptionController(
  createSubscriptionPlanUseCase,
  updateSubscriptionPlanUseCase,
  deleteSubscriptionPlanUseCase,
  getAllSubscriptionPlansUseCase,
  getActivePlansUseCase,
  createSubscriptionCheckoutUseCase,
  providerProfileRepository,
  providerSubscriptionRepository,
);
