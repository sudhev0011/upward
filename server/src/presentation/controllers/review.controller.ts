import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  validateUserId,
  sendSuccessResponse,
  handleAsyncError,
} from '../../shared/utils/presentation/controller.utils';
import { CreateReviewUseCase } from '../../application/use-cases/review/create-review.use-case';
import { GetProviderReviewsUseCase } from '../../application/use-cases/review/get-provider-reviews.use-case';
import { GetClientReviewsUseCase } from '../../application/use-cases/review/get-client-reviews.use-case';
import { GetPendingReviewsUseCase } from '../../application/use-cases/review/get-pending-reviews.use-case';
import { CompleteBookingUseCase } from '../../application/use-cases/booking/complete-booking.use-case';

export class ReviewController {
  constructor(
    private readonly _createReviewUseCase: CreateReviewUseCase,
    private readonly _getProviderReviewsUseCase: GetProviderReviewsUseCase,
    private readonly _getClientReviewsUseCase: GetClientReviewsUseCase,
    private readonly _getPendingReviewsUseCase: GetPendingReviewsUseCase,
    private readonly _completeBookingUseCase: CompleteBookingUseCase
  ) {}

  createReview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const clientId = validateUserId(req);
      const { bookingId, rating, comment } = req.body;

      if (!bookingId || rating === undefined) {
        res.status(400).json({ success: false, message: 'bookingId and rating are required' });
        return;
      }

      const result = await this._createReviewUseCase.execute({
        bookingId: bookingId as string,
        clientId,
        rating: Number(rating),
        comment: comment ? (comment as string) : null,
      });

      sendSuccessResponse(res, 'Review submitted successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getProviderReviews = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const providerId = req.params.providerId as string;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await this._getProviderReviewsUseCase.execute(providerId, page, limit);
      sendSuccessResponse(res, 'Provider reviews retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getClientReviews = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const clientId = validateUserId(req);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await this._getClientReviewsUseCase.execute(clientId, page, limit);
      sendSuccessResponse(res, 'Client reviews retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getPendingReviews = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const clientId = validateUserId(req);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await this._getPendingReviewsUseCase.execute(clientId, page, limit);
      sendSuccessResponse(res, 'Pending reviews retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  completeBooking = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const bookingId = req.params.id as string;

      await this._completeBookingUseCase.execute(bookingId, providerId);
      sendSuccessResponse(res, 'Booking completed successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
