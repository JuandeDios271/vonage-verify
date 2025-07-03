import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'

// Path where logs will be stored
const logDir = path.resolve('logs')

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Add custom levels, including 'http'
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2, // used for morgan
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
}

winston.addColors(customLevels.colors)

// Transport for daily files
const transport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/app-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '7d',
    level: 'http'
});


// Create logger with custom levels
const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'http',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] ${message}`
        })
    ),
    transports: [
        transport,
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

export default logger
