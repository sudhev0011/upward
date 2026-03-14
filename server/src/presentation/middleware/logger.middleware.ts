import morgan from "morgan"
import { morganStream } from '../../infrastructure/config/morgan'


export const requestLogger = morgan(
  ":method :url :status :response-time ms",
  {
    stream: morganStream
  }
)