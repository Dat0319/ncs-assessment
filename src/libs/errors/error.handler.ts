import StatusCodes from '../../utils/status-code';
import { BaseOptionError } from '../interfaces';

export class ErrorHandler extends Error {
  status: number;
  error;
  code: string | undefined;

  constructor(params?: BaseOptionError) {
    super();
    this.status = params?.status ?? 400;
    this.message =
      params?.message ?? StatusCodes.getReasonPhraseCode(this.status);
    this.error = params?.error;
    this.code = params?.code;
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}
