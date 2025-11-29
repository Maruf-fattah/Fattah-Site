import config from '../config/config';

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

const logLevelOrder: Record<LogLevel, number> = {
  [LogLevel.ERROR]: 0,
  [LogLevel.WARN]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.DEBUG]: 3,
};

const currentLogLevel = LogLevel[config.LOG_LEVEL.toUpperCase() as keyof typeof LogLevel] || LogLevel.INFO;

const formatTimestamp = (): string => {
  return new Date().toISOString();
};

const shouldLog = (level: LogLevel): boolean => {
  return logLevelOrder[level] <= logLevelOrder[currentLogLevel];
};

const formatLog = (level: LogLevel, message: string, data?: unknown): string => {
  const timestamp = formatTimestamp();
  const context = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${context}`;
};

export const logger = {
  error: (message: string, data?: unknown): void => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatLog(LogLevel.ERROR, message, data));
    }
  },

  warn: (message: string, data?: unknown): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatLog(LogLevel.WARN, message, data));
    }
  },

  info: (message: string, data?: unknown): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.log(formatLog(LogLevel.INFO, message, data));
    }
  },

  debug: (message: string, data?: unknown): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.log(formatLog(LogLevel.DEBUG, message, data));
    }
  },
};

export default logger;
