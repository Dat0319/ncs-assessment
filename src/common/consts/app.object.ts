export class AppObject {
  static readonly TOKEN_TYPES = {
    BEARER: 'Bearer',
  };

  static readonly ERR_CODE_DB = {
    UNIQUE: '23505',
  };

  static readonly ORDER_STATES = {
    SHIPPING: 'shipping',
    PENDING: 'pending',
    SUCCESS: 'success',
    REJECT: 'reject',
  };

  static readonly INDEX_DB = {
    UNIQUE_EMAIL: 'idx_unique_email',
    UNIQUE_PRODUCT: 'idx_unique_product',
    UNIQUE_USER_ROLE: 'idx_unique_user_role',
  };

  static readonly GENDER = {
    MALE: 'male',
    FEMALE: 'female',
  };

  static readonly MODULES = {
    USER: 'User',
    ADMIN: 'Admin',
  };

  static readonly ADMIN_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    STAFF: 'staff',
  };

  static readonly CUSTOMER_ROLES = { CUSTOMER: 'customer' };

  static readonly ALL_ROLES = Object.assign(
    this.ADMIN_ROLES,
    this.CUSTOMER_ROLES
  );

  static readonly ENVIRONMENTS = {
    DEV: 'dev',
    LOCAL: 'local',
    PRODUCTION: 'production',
  };

  static readonly COMMON_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted',
  };

  static readonly USER_STATUS = {
    ...AppObject.COMMON_STATUS,
    UNVERIFIED: 'unverified',
    SUSPEND: 'suspend',
  };

  static readonly USER_TYPE = {
    TEACHER: 'teacher',
    STUDENT: 'student',
  };

  static readonly PERMISSION_ACTIONS = {
    REGISTER_STUDENT_TO_TEACHER: 'REGISTER_STUDENT_TO_TEACHER',
    GET_COMMON_STUDENTS: 'GET_COMMON_STUDENTS',
    SUSPEND_STUDENT: 'SUSPEND_STUDENT',
    GET_NOTIFICATION_RECIPIENTS: 'GET_NOTIFICATION_RECIPIENTS',
  };

  static readonly PRODUCT_STATUS = {
    ...AppObject.COMMON_STATUS,
    SOLD_OUT: 'sold_out',
  };

  static readonly PRODUCT_CATEGORY = {
    COFFEE: 'coffee',
    TEE: 'tee',
    ACCESSORY: 'accessory',
  };

  static readonly REQUEST_OBJECT = {
    BODY: 'body',
    PARAMS: 'params',
    QUERY: 'query',
  };

  static readonly GRANT_TYPES = {
    PASSWORD: 'password',
    FACEBOOK: 'facebook',
    GOOGLE: 'google',
  };

  static readonly INDEX_COMPLEX = {
    settings: {
      analysis: {
        analyzer: {
          my_analyzer: {
            tokenizer: 'my_custom_analyzer',
          },
        },
        tokenizer: {
          my_custom_analyzer: {
            type: 'standard',
            tokenizer: 'english',
            char_filter: ['html_strip'],
            filter: ['lowercase', 'asciifolding'],
          },
        },
      },
    },
    mappings: {
      products: {
        properties: {
          name: { type: 'string', analyzer: 'my_analyzer' },
          description: { type: 'string' },
        },
      },
    },
  };
}
