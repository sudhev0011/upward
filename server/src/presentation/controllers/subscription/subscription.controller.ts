import { Request, Response, NextFunction } from "express";
import { CreateSubscriptionCheckoutUseCase } from "../../../application/use-cases/provider/subscription/create-subscription-checkout.use-case";
import { IProviderProfileRepository } from "../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IProviderSubscriptionRepository } from "../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import {
  handleAsyncError,
  handleValidationError,
  sendCreatedResponse,
  sendSuccessResponse,
  validateUserId,
} from "../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { GetAllPlansQuerySchema } from "../../../application/dtos/admin/subscription/request/getAllPlansRequest.dto";
import { ICreateSubscriptionPlanUseCase } from "../../../domain/interfaces/usecases/subscription/ICreateSubscriptionPlanUseCase";
import { IUpdateSubscriptionPlanUseCase } from "../../../domain/interfaces/usecases/subscription/IUpdateSubscriptionPlanUseCase";
import { IDeleteSubscriptionPlanUseCase } from "../../../domain/interfaces/usecases/subscription/IDeleteSubscriptionPlanUseCase";
import { IGetActivePlansUseCase } from "../../../domain/interfaces/usecases/subscription/IGetActivePlansUseCase";
import { IGetAllSubscriptionPlansUseCase } from "../../../domain/interfaces/usecases/subscription/IGetAllSubscriptionPlansUseCase";
import { ICreateSubscriptionCheckoutUseCase } from "../../../domain/interfaces/usecases/subscription/ICreateSubscriptionCheckoutUseCase";
import { CreateSubscriptionPlanRequestDto, UpdateSubscriptionPlanRequestDto } from "../../../application/dtos/admin/subscription/request/createSubscriptionPlanRequest.dto";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";

export class SubscriptionController {
  constructor(
    private readonly createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private readonly deleteSubscriptionPlanUseCase: IDeleteSubscriptionPlanUseCase,
    private readonly getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,
    private readonly getActivePlansUseCase: IGetActivePlansUseCase,
    private readonly createSubscriptionCheckoutUseCase: ICreateSubscriptionCheckoutUseCase,
    private readonly providerProfileRepository: IProviderProfileRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}

  createPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {

      const parsed = CreateSubscriptionPlanRequestDto.safeParse(req.body); 

      if(!parsed.success){
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const plan = await this.createSubscriptionPlanUseCase.execute(parsed.data);

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

      if(!id){
        return handleValidationError('invalid plan id received please provide correct one', next)
      }

      const parsed = UpdateSubscriptionPlanRequestDto.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const plan = await this.updateSubscriptionPlanUseCase.execute(id as string, parsed.data);

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
      const validatedQueries = GetAllPlansQuerySchema.parse(req.query);

      const plans =
        await this.getAllSubscriptionPlansUseCase.execute(validatedQueries);

      sendSuccessResponse(
        res,
        "Subscription plans fetched successfully",
        plans,
      );
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
      const checkoutData = await this.createSubscriptionCheckoutUseCase.execute(
        {
          providerId,
          planId: String(planId),
        },
      );

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

      const history =
        await this.providerSubscriptionRepository.findByProviderId(providerId);

      const data = {
        activeSubscriptionExpiresAt:
          profile?.activeSubscriptionExpiresAt || null,
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
