import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import logger from './logger';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = logger;
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    // Make trace optional
    if (trace) {
      this.logger.error(message, { trace });
    } else {
      this.logger.error(message);
    }
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
