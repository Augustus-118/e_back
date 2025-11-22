import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    dexScreenerApi: 'https://api.dexscreener.com/latest/dex',
    jupiterApi: 'https://lite-api.jup.ag/tokens/v2/search',
    cacheTTL: 30, // seconds
};
