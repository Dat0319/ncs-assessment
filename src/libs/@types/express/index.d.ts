declare namespace Express {
  interface Request {
    user: TokenModel;
  }

  interface Response {
    success;
    error;
    handler;
  }

  export interface TokenModel {
    id: string;
    role: string;
    [key: string]: any;
  }
}
