import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  bookingController,
  clientProfileController,
  paymentController,
} from "../../infrastructure/di/clientDi";
import { slotController } from "../../infrastructure/di/provider.Di";
import { UserRole } from "../../domain/enums/user-role.enum";
export class ClientRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.post("/profile", clientProfileController.createClientProfile);
    this.router.get("/profile", clientProfileController.getClientProfile);
    this.router.put("/profile", clientProfileController.updateClientProfile);
    this.router.post(
      "/profile-upload-url",
      clientProfileController.uploadAvatar,
    );

    this.router.get(
      "/providers/:providerId/services/:serviceId/slots",
      slotController.getAvailableSlots,
    );

    this.router.post("/bookings", bookingController.createBooking);
    this.router.post(
      "/payments/create-intent",
      
      paymentController.createPaymentIntent,
    );

    this.router.get("/bookings", bookingController.listBookings(UserRole.CLIENT));
  }
}
