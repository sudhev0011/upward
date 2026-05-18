import winston from "winston";
import { TransformableInfo } from "logform";

const { combine, timestamp, printf, colorize, json } = winston.format;

interface LogInfoWithCustomError extends TransformableInfo {
  error?: unknown;
}

const extractErrorProperties = winston.format(
  (info: TransformableInfo): TransformableInfo => {
    const customInfo = info as LogInfoWithCustomError;

    if (customInfo.error instanceof Error) {
      const err = customInfo.error;

      const extracted = {
        ...customInfo,
        stack: err.stack,
        name: err.name,
        ...Object.getOwnPropertyNames(err).reduce(
          (acc, key) => {
            if (key !== "stack" && key !== "message" && key !== "name") {
              acc[key] = (err as any)[key];
            }
            return acc;
          },
          {} as Record<string, any>,
        ),
      };

      delete extracted.error;
      return extracted;
    }

    return info;
  },
);

const consoleLogFormat = printf(
  ({ level, message, timestamp, stack, name, ...meta }) => {
    const errorNamePrefix =
      name && name !== "Error" ? `\x1b[31m[${name}]\x1b[0m ` : "";

    let output = `${timestamp} [${level}]: ${errorNamePrefix}${message}`;

    if (Object.keys(meta).length) {
      const { method, url, statusCode, ...rest } = meta as any;

      const httpInfo =
        method && url
          ? `\n    ➡️  \x1b[36m${method}\x1b[0m ${url} | Status: \x1b[33m${statusCode || "N/A"}\x1b[0m`
          : "";

      const remainingMeta = Object.keys(rest).length
        ? `\n    ⚙️  Metadata: ${JSON.stringify(rest)}`
        : "";

      output += `${httpInfo}${remainingMeta}`;
    }

    if (stack && typeof stack === "string") {
      const formattedStack = stack
        .split("\n")
        .slice(1)
        .map((line) => `    ${line.trim()}`)
        .join("\n");

      output += `\n\n    🚨 \x1b[1m\x1b[31mStack Trace:\x1b[0m\n${formattedStack}\n`;
    }

    return output;
  },
);

export const winstonLogger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), extractErrorProperties(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleLogFormat),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
