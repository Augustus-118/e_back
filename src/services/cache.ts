import { createClient } from 'redis';
import { config } from '../config';

class CacheService {
    private client;

    constructor() {
        this.client = createClient({
            url: config.redisUrl,
        });

        this.client.on('error', (err) => console.log('Redis Client Error', err));

        this.connect();
    }

    private async connect() {
        await this.client.connect();
        console.log('Connected to Redis');
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttl: number = config.cacheTTL): Promise<void> {
        await this.client.set(key, value, {
            EX: ttl,
        });
    }
}

export const cacheService = new CacheService();
