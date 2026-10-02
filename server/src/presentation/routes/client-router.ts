// import { Router } from "express";
// import { authenticateToken } from "../middleware/auth.middleware";
// import {
//   bookingController,
//   clientProfileController,
//   paymentController,
//   walletController,
//   clientDashboardController,
// } from "../../infrastructure/di/clientDi";
// import { slotController } from "../../infrastructure/di/provider.Di";
// import { UserRole } from "../../domain/enums/user-role.enum";
// export class ClientRouter {
//   public router: Router;

//   constructor() {
//     this.router = Router();
//     this._initializeRoutes();
//   }

//   private _initializeRoutes(): void {
//     this.router.use(authenticateToken);

//     this.router.get("/dashboard/stats", clientDashboardController.getStats);

//     this.router.post("/profile", clientProfileController.createClientProfile);
//     this.router.get("/profile", clientProfileController.getClientProfile);
//     this.router.put("/profile", clientProfileController.updateClientProfile);
//     this.router.post(
//       "/profile-upload-url",
//       clientProfileController.uploadAvatar,
//     );

//     this.router.get(
//       "/providers/:providerId/services/:serviceId/slots",
//       slotController.getAvailableSlots,
//     );

//     this.router.post("/bookings/onsite", bookingController.createBooking);
//     this.router.post(
//       "/bookings/offsite",
//       bookingController.createOffsiteBooking,
//     );
//     this.router.patch(
//       "/bookings/:id/client-complete",
//       bookingController.clientCompleteBooking,
//     );
//     this.router.patch(
//       "/bookings/:id/cancel",
//       bookingController.cancelBooking(UserRole.CLIENT),
//     );
//     this.router.patch(
//       "/bookings/:id/reschedule/onsite",
//       bookingController.rescheduleOnsiteBooking,
//     );
//     this.router.patch(
//       "/bookings/:id/reschedule/offsite",
//       bookingController.rescheduleOffsiteBooking,
//     );

//     this.router.post(
//       "/payments/create-intent",

//       paymentController.createPaymentIntent,
//     );

//     this.router.post(
//       "/payments/remaining-intent",
//       paymentController.createRemainingPaymentIntent,
//     );

//     this.router.get(
//       "/bookings",
//       bookingController.listBookings(UserRole.CLIENT),
//     );
//     this.router.get("/wallet", walletController.getWallet);
//   }
// }






import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { clientProfileController } from "../../infrastructure/di/clientDi";
import { adminClientController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class ClientRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // ─── ADMIN MANAGEMENT ────────────────────────────────────────
    this.router.get("/", authorizeRoles(UserRole.ADMIN), adminClientController.getAllClients);
    this.router.get("/:id", authorizeRoles(UserRole.ADMIN), adminClientController.getClientById);
    this.router.patch("/:id/block", authorizeRoles(UserRole.ADMIN), adminClientController.blockClient);

    // ─── CLIENT SELF-MANAGEMENT (/me) ────────────────────────────
    this.router.post("/me/profile", authorizeRoles(UserRole.CLIENT), clientProfileController.createClientProfile);
    this.router.get("/me/profile", authorizeRoles(UserRole.CLIENT), clientProfileController.getClientProfile);
    this.router.put("/me/profile", authorizeRoles(UserRole.CLIENT), clientProfileController.updateClientProfile);
    this.router.post("/me/profile-upload-url", authorizeRoles(UserRole.CLIENT), clientProfileController.uploadAvatar);
  }
}