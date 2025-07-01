import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'

// Path where logs will be stored
const logDir = path.resolve('logs')

// Evaluate if directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const transport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/app-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '7d',
    level: 'info'
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`
        )
    ),
    transports: [
        transport,
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

export default logger
