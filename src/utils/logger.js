import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'

// Read level from .env or use 'info' by default
const logLevel = process.env.LOG_LEVEL || 'info';

// Path where logs will be stored
const logDir = path.resolve('logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Add custom levels, including 'http'
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2,
        info: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        http: 'cyan',
        info: 'green',
        debug: 'gray'
    }
};

winston.addColors(customLevels.colors);

// Transport for daily files
const fileTransport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/app-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '7d',
    level: 'http'
});

// Transport for console (useful with docker logs)
const consoleTransport = new winston.transports.Console({
    level: logLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
});

// Create logger with custom levels
const logger = winston.createLogger({
    levels: customLevels.levels,
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`
        })
    ),
    transports: [
        fileTransport,
        consoleTransport
    ]
});

export default logger
