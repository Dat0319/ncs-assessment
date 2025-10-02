import express, { Response } from 'express';
import { AppObject } from '../../common/consts';
import logger from '../../utils/logger';
import StatusCodes from '../../utils/status-code';
import { ErrorHandler } from '../errors';

/**
 * @method handler
 * @description Custom response http method
 * @param data
 */
express.response.handler = async function (data) {
  const res = _this(this);
  try {
    const result = await data;
    return res.status(result.status ?? 200).json(result);
  } catch (error) {
    return res.error(error ?? {}, res);
  }
};

/**
 * @method success
 * @description Custom response success
 * @param data
 */
express.response.success = function (data) {
  const res = _this(this);
  return res.status(200).json(data);
};

/**
 * @method error
 * @description Custom response error
 * @param error
 */
express.response.error = function (error) {
  const res = _this(this);
  let status = error.status;
  if (error.stack) {
    logger.error(error.stack);
  }
  if (!(error instanceof ErrorHandler)) {
    status = 500;
    error.message = StatusCodes.getReasonPhraseCode(status);
  }
  return res.status(status).json({
    // message: this.__.call(this, error.message),
    message: res.__(error.message),
    stack:
      process.env.NODE_ENV !== AppObject.ENVIRONMENTS.PRODUCTION && error.stack,
    status: status,
    errors: error.error ?? error.errors,
    code: error.code,
  });
};

function _this(val: Response) {
  return val;
}

export default express;
