import { createLogger, format, transports } from "winston";

export const log = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message, service }) => {
      return `[${timestamp}] ${service} ${level}: ${message} | ${__filename}`;
    }),
    format.errors({ stack: true }),
    format.metadata()
  ),
  defaultMeta: {
    service: "ez-pr-bot",
  },
});
