import { winstonLogger } from "./logger"

export const morganStream = {
  write: (message: string) => {
    winstonLogger.info(message.trim())
  }
}