import { Request, Response, NextFunction } from "express";
import { CreateSubscriptionPlanUseCase } from "../../../application/use-cases/admin/subscription-plan/create-subscription-plan.use-case";
import { UpdateSubscriptionPlanUseCase } from "../../../application/use-cases/admin/subscription-plan/update-subscription-plan.use-case";
import { DeleteSubscriptionPlanUseCase } from "../../../application/use-cases/admin/subscription-plan/delete-subscription-plan.use-case";
import { GetAllSubscriptionPlansUseCase } from "../../../application/use-cases/admin/subscription-plan/get-all-subscription-plans.use-case";
import { GetActivePlansUseCase } from "../../../application/use-cases/provider/subscription/get-active-plans.use-case";
import { CreateSubscriptionCheckoutUseCase } from "../../../application/use-cases/provider/subscription/create-subscription-checkout.use-case";
import { IProviderProfileRepository } from "../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IProviderSubscriptionRepository } from "../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import {
  handleAsyncError,
  sendCreatedResponse,
  sendSuccessResponse,
  validateUserId,
} from "../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

export class SubscriptionController {
  constructor(
    private readonly createSubscriptionPlanUseCase: CreateSubscriptionPlanUseCase,
    private readonly updateSubscriptionPlanUseCase: UpdateSubscriptionPlanUseCase,
    private readonly deleteSubscriptionPlanUseCase: DeleteSubscriptionPlanUseCase,
    private readonly getAllSubscriptionPlansUseCase: GetAllSubscriptionPlansUseCase,
    private readonly getActivePlansUseCase: GetActivePlansUseCase,
    private readonly createSubscriptionCheckoutUseCase: CreateSubscriptionCheckoutUseCase,
    private readonly providerProfileRepository: IProviderProfileRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}

  // --- Admin Endpoints ---

  createPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, price, billingCycle, features, isActive } = req.body;
      const plan = await this.createSubscriptionPlanUseCase.execute({
        name: String(name),
        price: Number(price),
        billingCycle: billingCycle === "yearly" ? "yearly" : "monthly",
        features: Array.isArray(features) ? features.map(String) : [],
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      });

      sendCreatedResponse(res, "Subscription plan created successfully", plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updatePlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, price, billingCycle, features, isActive } = req.body;
      const plan = await this.updateSubscriptionPlanUseCase.execute({
        id: String(id),
        name: name !== undefined ? String(name) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        billingCycle:
          billingCycle !== undefined
            ? billingCycle === "yearly"
              ? "yearly"
              : "monthly"
            : undefined,
        features: Array.isArray(features) ? features.map(String) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      });

      sendSuccessResponse(res, "Subscription plan updated successfully", plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deletePlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteSubscriptionPlanUseCase.execute(String(id));
      sendSuccessResponse(res, "Subscription plan deleted successfully", null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllPlans = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plans = await this.getAllSubscriptionPlansUseCase.execute();
      sendSuccessResponse(res, "Subscription plans fetched successfully", plans);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  // --- Provider Endpoints ---

  getActivePlans = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const plans = await this.getActivePlansUseCase.execute();
      sendSuccessResponse(
        res,
        "Active subscription plans fetched successfully",
        plans,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCheckout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      if (!providerId) {
        throw new Error("Provider ID is required.");
      }

      const { planId } = req.body;
      const checkoutData = await this.createSubscriptionCheckoutUseCase.execute({
        providerId,
        planId: String(planId),
      });

      sendSuccessResponse(
        res,
        "Checkout session initialized successfully",
        checkoutData,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getMyStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      if (!providerId) {
        throw new Error("Provider ID is required.");
      }

      const profile = await this.providerProfileRepository.findOne({
        userId: providerId,
      });

      const history = await this.providerSubscriptionRepository.findByProviderId(
        providerId,
      );

      const data = {
        activeSubscriptionExpiresAt: profile?.activeSubscriptionExpiresAt || null,
        activeSubscriptionPlanName: profile?.activeSubscriptionPlanName || null,
        history,
      };

      sendSuccessResponse(
        res,
        "Subscription status fetched successfully",
        data,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
