import { ILogger } from "../../domain/interfaces/services/ILogger"
import { winstonLogger } from "../config/logger"

export class WinstonLogger implements ILogger {
  info(message: string, meta?: unknown): void {
    winstonLogger.info(message, meta)
  }

  error(message: string, meta?: unknown): void {
    winstonLogger.error(message, meta)
  }

  warn(message: string, meta?: unknown): void {
    winstonLogger.warn(message, meta)
  }

  debug(message: string, meta?: unknown): void {
    winstonLogger.debug(message, meta)
  }
}