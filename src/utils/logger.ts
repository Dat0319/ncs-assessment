import { green, red } from 'chalk';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class LoggerUtil {
  private static instance: LoggerUtil;
  private transport: DailyRotateFile;
  private formatOptions: winston.Logform.Format;

  constructor() {
    if (LoggerUtil.instance) {
      return LoggerUtil.instance;
    }

    this.transport = new DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    });

    this.formatOptions = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label'],
      }),
      winston.format.splat(),
      winston.format.printf((info) => {
        const level = info.level.toUpperCase();
        let msg = `[${info.timestamp}][${level}]: ${info.message}`;

        switch (level) {
          case 'INFO':
            msg = green(msg);
            break;
          case 'WARN':
            break;
          case 'ERROR':
            msg = red(msg);
            break;
          case 'DEBUG':
            break;
          default:
            break;
        }

        return msg;
      })
    );
    LoggerUtil.instance = this;
  }

  public logger() {
    return winston.createLogger({
      transports: [
        this.transport,
        new winston.transports.Console({ format: this.formatOptions }),
      ],
    });
  }
}

export default new LoggerUtil().logger();
