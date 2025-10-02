import { RedisClient } from 'redis';

export class CacheManagerUtil {
  private static instance: CacheManagerUtil;
  public client: RedisClient;

  constructor(client: RedisClient) {
    if (CacheManagerUtil.instance) {
      return CacheManagerUtil.instance;
    }

    CacheManagerUtil.instance = this;
    this.client = client;
  }

  async setKey(params: {
    key: string;
    value: string;
    exp?: number;
  }): Promise<string | null> {
    return new Promise((resolve, reject) => {
      return this.client.setex(
        params.key,
        params.exp ?? -1,
        params.value,
        (err, val) => {
          if (err) {
            reject(err);
          }
          resolve(val);
        }
      );
    });
  }

  async delKey(key: string | string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async getKey(
    key: string
  ): Promise<{ [key: string]: string | number } | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val ? JSON.parse(val) : val);
      });
    });
  }

  async getKeys(key: string): Promise<string[] | null> {
    return new Promise((resolve, reject) => {
      this.client.keys(key, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async hashSet(key: string, field: string, value: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hset(key, field, value, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async hashGet(key: string, field: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      this.client.hget(key, field, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async hashGetAll(key: string): Promise<{ [x: string]: string }> {
    return new Promise((resolve, reject) => {
      this.client.hgetall(key, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async hashDel(key: string, field: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hdel(key, field, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }

  async push<T>(queue: string, dataArr: T[]): Promise<number> {
    const msgArr: string[] = [];
    for (let i = 0; i < dataArr.length; i++) {
      msgArr.push(JSON.stringify(dataArr[i]));
    }
    return new Promise((resolve, reject) => {
      this.client.rpush(queue, msgArr, (err, val) => {
        if (err) {
          reject(err);
        }
        resolve(val);
      });
    });
  }
}
