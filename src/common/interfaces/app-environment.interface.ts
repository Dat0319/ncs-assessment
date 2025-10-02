export interface AppEnvironment {
  NAME: string;
  APP: {
    PORT: number;
  };
  SECURE: {
    COOKIE_SECRET_KEY: string;
    PASSWORD_SECRET_KEY: string;
    JWT_ACCESS_TOKEN: {
      SECRET_KEY: string;
      EXPIRED_TIME: number;
    };
    JWT_REFRESH_TOKEN: {
      SECRET_KEY: string;
      EXPIRED_TIME: number;
    };
  };
  DATABASE: {
    MONGODB?: {
      USERNAME: string;
      PASSWORD: string;
      HOST: string;
      PORT: number;
      NAME: string;
    };
    MYSQL: {
      USERNAME: string;
      PASSWORD: string;
      HOST: string;
      PORT: number;
      NAME: string;
    };
    REDIS: {
      HOST: string;
      PORT: number;
      PASSWORD: string;
      DATABASE: number;
    };
  };
  OAUTH2: {
    [key: string]: {
      CLIENT_ID: string;
      CLIENT_SECRET: string;
    };
  };
  MAIL_CONFIG: {
    SMTP_CONFIG: {
      HOST: string;
      PORT: number;
      SECURE: boolean;
      AUTH: {
        USER: string;
        PASS: string;
      };
    };
  };
}
