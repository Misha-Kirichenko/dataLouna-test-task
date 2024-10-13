import Redis from 'ioredis';

export abstract class AbstractCacheService {
  protected client: Redis;

  constructor() {
    this.client = new Redis({
      port: Number(process.env.REDIS_PORT),
      host: 'redis',
    });
  }

  //ttl must be passed in seconds
  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringifiedValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, stringifiedValue, 'EX', ttl);
    } else {
      await this.client.set(key, stringifiedValue);
    }
  }

  public async destroy(...key: string[]): Promise<void> {
    await this.client.del(...key);
  }

  public async get<T>(key: string): Promise<T> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      const parsed = this.parseRedisValue<T>(data);
      return parsed;
    } catch (_) {
      return null;
    }
  }

  public parseRedisValue<T>(value: any): T {
    try {
      return JSON.parse(value);
    } catch (_) {
      return value as T;
    }
  }
}
