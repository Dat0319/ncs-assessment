// @typescript-eslint/ban-ts-comment
const redisMock = {
  setex: jest
    .fn()
    .mockImplementation((key, exp, value, callback) => callback(null, 'OK')),
  del: jest.fn().mockImplementation((key, callback) => callback(null, 1)),
  get: jest.fn().mockImplementation((key, callback) => callback(null, null)),
  keys: jest.fn().mockImplementation((pattern, callback) => callback(null, [])),
  hset: jest
    .fn()
    .mockImplementation((key, field, value, callback) => callback(null, 1)),
  hget: jest
    .fn()
    .mockImplementation((key, field, callback) => callback(null, null)),
  hgetall: jest.fn().mockImplementation((key, callback) => callback(null, {})),
  hdel: jest
    .fn()
    .mockImplementation((key, field, callback) => callback(null, 1)),
  rpush: jest
    .fn()
    .mockImplementation((queue, msgs, callback) => callback(null, msgs.length)),
  quit: jest.fn().mockImplementation((cb) => cb && cb(null, 'OK')),
  end: jest.fn().mockImplementation(() => undefined),
};

module.exports = {
  createClient: jest.fn(() => redisMock),
};
