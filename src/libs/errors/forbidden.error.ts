import { BaseOptionError } from '../interfaces';
import { ErrorHandler } from './error.handler';

export class ForbiddenError extends ErrorHandler {
  constructor(params: BaseOptionError = {}) {
    super(Object.assign(params, { status: 403 }));
  }
}
