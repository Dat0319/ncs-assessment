// import { AppEnvironment } from '../../common/interfaces';

// export const ENV: AppEnvironment = {
//   NAME: 'production',
//   APP: {
//     PORT: 8080,
//   },
//   SECURE: {
//     COOKIE_SECRET_KEY: 'local-cookie#123456a@A',
//     PASSWORD_SECRET_KEY: 'passwordsecretkey#123456a@A',
//     JWT_ACCESS_TOKEN: {
//       EXPIRED_TIME: 30 * 60,
//       SECRET_KEY: 'local-access-token#123456a@A',
//     },
//     JWT_REFRESH_TOKEN: {
//       EXPIRED_TIME: 30 * 60,
//       SECRET_KEY: 'local-refresh-token#123456a@A',
//     },
//   },
//   DATABASE: {
//     MYSQL: {
//       USERNAME: 'postgres',
//       PASSWORD: 'postgres@123',
//       HOST: 'db.lbzallnzxudagdmrjtru.supabase.co',
//       PORT: 5432,
//       NAME: 'postgres',
//     },
//     REDIS: {
//       HOST: 'redis-12778.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
//       PORT: 12778,
//       PASSWORD: 'mjqobYRnaOkgaa3HS9d4SrNiDsKrlbNO',
//       DATABASE: 0,
//       // HOST: 'localhost',
//       // PORT: 6379,
//       // PASSWORD: '',
//       // DATABASE: 0,
//     },
//   },
//   OAUTH2: {
//     GOOGLE: {
//       CLIENT_ID:
//         '',
//       CLIENT_SECRET: '',
//     },
//     FACEBOOK: {
//       CLIENT_ID:
//         '',
//       CLIENT_SECRET: '',
//     },
//   },
// };

import { AppEnvironment } from '../../common/interfaces';

export const ENV: AppEnvironment = {
  NAME: 'local',
  APP: {
    PORT: 8080,
  },
  SECURE: {
    COOKIE_SECRET_KEY: 'local-cookie#123456a@A',
    PASSWORD_SECRET_KEY: 'passwordsecretkey#123456a@A',
    JWT_ACCESS_TOKEN: {
      EXPIRED_TIME: 24 * 60 * 60,
      SECRET_KEY: 'local-access-token#123456a@A',
    },
    JWT_REFRESH_TOKEN: {
      EXPIRED_TIME: 10 * 24 * 60 * 60,
      SECRET_KEY: 'local-refresh-token#123456a@A',
    },
  },
  DATABASE: {
    MYSQL: {
      USERNAME: 'ncs',
      PASSWORD: 'Book@123',
      HOST: 'db-ncs-mysql',
      PORT: 3306,
      NAME: 'ncs',
      // USERNAME: 'postgres',
      // PASSWORD: 'postgres@123',
      // HOST: 'db.lbzallnzxudagdmrjtru.supabase.co',
      // PORT: 5432,
      // NAME: 'postgres',
    },
    REDIS: {
      // HOST: 'redis-12778.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
      // PORT: 12778,
      // PASSWORD: 'mjqobYRnaOkgaa3HS9d4SrNiDsKrlbNO',
      // DATABASE: 0,
      // HOST: 'redis-15573.c1.ap-southeast-1-1.ec2.cloud.redislabs.com',
      // PORT: 15573,
      // PASSWORD: 'mM4bFqYObi4jRgZ5pRs2AFUluAG65jhN',
      // DATABASE: 0,
      HOST: 'db-ncs-redis',
      PORT: 6379,
      PASSWORD: 'mM4bFqYObi4jRgZ5pRs2AFUluAG65jhN',
      DATABASE: 0,
    },
  },
  OAUTH2: {
    GOOGLE: {
      CLIENT_ID: '',
      CLIENT_SECRET: '',
    },
    FACEBOOK: {
      CLIENT_ID: '',
      CLIENT_SECRET: '',
    },
  },
  MAIL_CONFIG: {
    SMTP_CONFIG: {
      HOST: 'smtp.gmail.com',
      PORT: 465,
      SECURE: true,
      AUTH: {
        USER: 'dsystem303@gmail.com',
        PASS: 'ICVFFE9tH7QkEjw4',
      },
    },
  },
};
