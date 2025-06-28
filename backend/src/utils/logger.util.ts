import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Configuration des niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Déterminer le niveau de log en fonction de l'environnement
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

// Configuration des couleurs pour la console
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Format des logs
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}`
  )
);

// Correction : Utilisation d'une fonction explicite pour gérer le spread
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => {
    const logEntry: Record<string, any> = {
      timestamp: info.timestamp,
      level: info.level,
      message: info.message
    };
    
    // Ajout conditionnel de la stack trace
    if (info.stack) {
      logEntry.stack = info.stack;
    }
    
    return JSON.stringify(logEntry);
  })
);

// Transports (sorties)
const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    format: fileFormat,
  }),
  new DailyRotateFile({
    filename: "logs/all-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    format: fileFormat,
  }),
];

// Créer l'instance de logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;