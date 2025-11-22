import request from 'supertest';
import { app } from '../app';
import { aggregatorService } from '../services/aggregator';
import { TokenData } from '../types';

// Mock the aggregator service
jest.mock('../services/aggregator');

describe('API Endpoints', () => {
    const mockAggregatorService = aggregatorService as jest.Mocked<typeof aggregatorService>;

    const mockTokens: TokenData[] = [
        {
            token_address: '0x123',
            token_name: 'Solana',
            token_ticker: 'SOL',
            price_sol: 68.5,
            market_cap_sol: 1000000,
            volume_sol: 50000,
            liquidity_sol: 100000,
            transaction_count: 100,
            price_1hr_change: 2.5,
            protocol: 'pancakeswap'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/tokens', () => {
        it('should return 200 and token data', async () => {
            mockAggregatorService.getAggregatedData.mockResolvedValue(mockTokens);

            const response = await request(app)
                .get('/api/tokens')
                .query({ q: 'SOL' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTokens);
            expect(mockAggregatorService.getAggregatedData).toHaveBeenCalledWith('SOL');
        });

        it('should use default query when q parameter is missing', async () => {
            mockAggregatorService.getAggregatedData.mockResolvedValue(mockTokens);

            const response = await request(app).get('/api/tokens');

            expect(response.status).toBe(200);
            expect(mockAggregatorService.getAggregatedData).toHaveBeenCalledWith('SOL');
        });

        it('should return empty array when no tokens found', async () => {
            mockAggregatorService.getAggregatedData.mockResolvedValue([]);

            const response = await request(app)
                .get('/api/tokens')
                .query({ q: 'NONEXISTENT' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it('should handle errors gracefully', async () => {
            mockAggregatorService.getAggregatedData.mockRejectedValue(
                new Error('API Error')
            );

            const response = await request(app)
                .get('/api/tokens')
                .query({ q: 'SOL' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });

        it('should accept different query parameters', async () => {
            mockAggregatorService.getAggregatedData.mockResolvedValue(mockTokens);

            const queries = ['DOGE', 'PEPE', 'BTC'];

            for (const query of queries) {
                await request(app).get('/api/tokens').query({ q: query });
                expect(mockAggregatorService.getAggregatedData).toHaveBeenCalledWith(query);
            }
        });

        it('should return JSON content type', async () => {
            mockAggregatorService.getAggregatedData.mockResolvedValue(mockTokens);

            const response = await request(app).get('/api/tokens');

            expect(response.headers['content-type']).toMatch(/json/);
        });
    });
});
