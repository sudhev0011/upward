import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectToDatabase } from "../../infrastructure/persistence/mongodb/connection/mongoose";
import { connectRedis } from "../../infrastructure/persistence/redis/connection/redis";
import { env } from "../../infrastructure/config/env";

// ─── ROUTER IMPORTS ────────────────────────────────────────────────────────
import { AuthRouter } from "../routes/auth-router";
import { PublicRouter } from "../routes/public-router";
import { WebhookRouter } from "../routes/webhook-router";
import { LocationRouter } from "../routes/location.router";
import { ChatRouter } from "../routes/chat-router";
import { SubscriptionRouter } from "../routes/subscription.router";
import { NotificationRouter } from "../routes/notification-router";
import { ReviewRouter } from "../routes/review-router";
import { BookingRouter } from "../routes/bookings.router";
import { ClientRouter } from "../routes/client-router";

// New Resource-Based Routers
import { ProviderRouter } from "../routes/provider.router";
import { CategoryRouter } from "../routes/category.router";
import { ServiceRouter } from "../routes/service.router";
import { PaymentRouter } from "../routes/payment.router";
import { PayoutRouter } from "../routes/payout.router";
import { WalletRouter } from "../routes/wallet.router";
import { DashboardRouter } from "../routes/dashboard.router";
// ───────────────────────────────────────────────────────────────────────────

import { errorHandler } from "../middleware/error-handler";
import { requestLogger } from "../middleware/logger.middleware";
import { winstonLogger } from "../../infrastructure/config/logger";
import { bookingExpirationJob, providerPayoutJob, expirePendingSubscriptionsJob } from "../../infrastructure/di/jobsDi";
import { initSocketServer } from "./socket-server";
import { systemUserInitializer } from "../../infrastructure/di/startupDi";

export class AppServer {
  private _app: express.Application;
  private _port: number;
  private _httpServer: ReturnType<typeof createServer>;

  constructor() {
    this._app = express();
    this._port = Number(env.PORT ?? 4000);
    this._httpServer = createServer(this._app);
  }

  public init(): void {
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this._app.use(
      cors({
        origin: env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      }),
    );
    
    this._app.use(requestLogger);
    this._app.use("/api/webhooks", new WebhookRouter().router);
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser());
  }

  private configureRoutes(): void {
    // ─── CORE / PUBLIC ROUTES ──────────────────────────────────────────────
    this._app.use("/api/auth", new AuthRouter().router);
    this._app.use("/api/public", new PublicRouter().router);
    
    // ─── NEW RESOURCE-BASED ROUTES ─────────────────────────────────────────
    this._app.use("/api/bookings", new BookingRouter().router);
    this._app.use("/api/providers", new ProviderRouter().router);
    this._app.use("/api/clients", new ClientRouter().router);
    this._app.use("/api/categories", new CategoryRouter().router);
    this._app.use("/api/services", new ServiceRouter().router);
    this._app.use("/api/payments", new PaymentRouter().router);
    this._app.use("/api/payouts", new PayoutRouter().router);
    this._app.use("/api/wallets", new WalletRouter().router);
    this._app.use("/api/dashboards", new DashboardRouter().router);
    
    // ─── FEATURE ROUTES ────────────────────────────────────────────────────
    this._app.use("/api/location", new LocationRouter().router);
    this._app.use("/api/chat", new ChatRouter().router);
    this._app.use("/api/subscriptions", new SubscriptionRouter().router);
    this._app.use("/api/notifications", new NotificationRouter().router);
    this._app.use("/api/reviews", new ReviewRouter().router);

    // Global Error Handler
    this._app.use(errorHandler);
  }

  public async connectDatabase(): Promise<void> {
    try {
      await connectToDatabase(env.MONGO_URI as string);
      winstonLogger.info("connected to MongoDB");
    } catch (error) {
      winstonLogger.error("MongoDB connection failed:", error);
      throw error;
    }

    try {
      await connectRedis();
      winstonLogger.info("Connected to Redis");
    } catch (error) {
      winstonLogger.error("Redis connection failed:", error);
      throw error;
    }
  }

  private initializeJobs(): void {
    bookingExpirationJob.start();
    providerPayoutJob.start();
    expirePendingSubscriptionsJob.start();

    winstonLogger.info("Background jobs initialized");
  }

  public async start(): Promise<void> {
    try {
      await this.connectDatabase();
      await systemUserInitializer.initialize();
      this.init();
      this.initializeJobs();
      initSocketServer(this._httpServer);

      this._httpServer.listen(this._port, () => {
        winstonLogger.info(`Server running on http://localhost:${this._port}`);
      });
    } catch (error) {
      winstonLogger.error("Server startup failed:", error);
      throw error;
    }
  }
}