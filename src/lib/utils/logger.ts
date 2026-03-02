import { randomUUID } from "crypto";

/**
 * Lightweight structured logger with correlation IDs.
 * In production, replace with a proper logging library
 * (e.g., pino, winston) that outputs JSON for log aggregation.
 */

export function createCorrelationId(): string {
  return randomUUID();
}

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

function log(entry: LogEntry): void {
  const output = JSON.stringify(entry);

  switch (entry.level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(output);
      }
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  info(message: string, meta?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log({ level: "info", message, timestamp: new Date().toISOString(), ...meta });
  },
  warn(message: string, meta?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log({ level: "warn", message, timestamp: new Date().toISOString(), ...meta });
  },
  error(message: string, meta?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log({ level: "error", message, timestamp: new Date().toISOString(), ...meta });
  },
  debug(message: string, meta?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log({ level: "debug", message, timestamp: new Date().toISOString(), ...meta });
  },

  /** Audit log for critical user actions */
  audit(action: string, userId: string, metadata?: Record<string, unknown>) {
    log({
      level: "info",
      message: `AUDIT: ${action}`,
      action,
      userId,
      metadata,
      timestamp: new Date().toISOString(),
    });
  },
};
