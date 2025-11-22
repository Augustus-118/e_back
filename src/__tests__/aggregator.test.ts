import { AggregatorService } from '../services/aggregator';
import { fetcherService } from '../services/fetcher';
import { cacheService } from '../services/cache';
import { TokenData } from '../types';

// Mock the dependencies
jest.mock('../services/fetcher');
jest.mock('../services/cache');

describe('AggregatorService', () => {
    let aggregatorService: AggregatorService;
    const mockFetcherService = fetcherService as jest.Mocked<typeof fetcherService>;
    const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;

    beforeEach(() => {
        aggregatorService = new AggregatorService();
        jest.clearAllMocks();
    });

    describe('getAggregatedData', () => {
        const mockDexData: TokenData[] = [
            {
                token_address: '0x123',
                token_name: 'Token A',
                token_ticker: 'TKA',
                price_sol: 1.5,
                market_cap_sol: 1000000,
                volume_sol: 50000,
                liquidity_sol: 100000,
                transaction_count: 100,
                price_1hr_change: 5.2,
                protocol: 'dex1'
            },
            {
                token_address: '0x456',
                token_name: 'Token B',
                token_ticker: 'TKB',
                price_sol: 2.5,
                market_cap_sol: 2000000,
                volume_sol: 75000,
                liquidity_sol: 150000,
                transaction_count: 200,
                price_1hr_change: -3.1,
                protocol: 'dex2'
            }
        ];

        const mockJupData: TokenData[] = [
            {
                token_address: '0x123', // Duplicate with DexScreener
                token_name: 'Token A',
                token_ticker: 'TKA',
                price_sol: 0,
                market_cap_sol: 0,
                volume_sol: 0,
                liquidity_sol: 0,
                transaction_count: 0,
                price_1hr_change: 0,
                protocol: 'Jupiter'
            },
            {
                token_address: '0x789', // New token
                token_name: 'Token C',
                token_ticker: 'TKC',
                price_sol: 0,
                market_cap_sol: 0,
                volume_sol: 0,
                liquidity_sol: 0,
                transaction_count: 0,
                price_1hr_change: 0,
                protocol: 'Jupiter'
            }
        ];

        it('should return cached data if available', async () => {
            const cachedData = JSON.stringify(mockDexData);
            mockCacheService.get.mockResolvedValue(cachedData);

            const result = await aggregatorService.getAggregatedData('SOL');

            expect(mockCacheService.get).toHaveBeenCalledWith('tokens_v5:SOL');
            expect(result).toEqual(mockDexData);
            expect(mockFetcherService.fetchDexScreenerData).not.toHaveBeenCalled();
        });

        it('should fetch from APIs when cache misses', async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockFetcherService.fetchDexScreenerData.mockResolvedValue(mockDexData);
            mockFetcherService.fetchJupiterData.mockResolvedValue(mockJupData);

            const result = await aggregatorService.getAggregatedData('SOL');

            expect(mockFetcherService.fetchDexScreenerData).toHaveBeenCalledWith('SOL');
            expect(mockFetcherService.fetchJupiterData).toHaveBeenCalledWith('SOL');
            expect(mockCacheService.set).toHaveBeenCalled();
        });

        it('should merge and deduplicate tokens correctly', async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockFetcherService.fetchDexScreenerData.mockResolvedValue(mockDexData);
            mockFetcherService.fetchJupiterData.mockResolvedValue(mockJupData);

            const result = await aggregatorService.getAggregatedData('SOL');

            // Should have 3 unique tokens (2 from Dex + 1 new from Jupiter)
            expect(result).toHaveLength(3);

            // Should prefer DexScreener data for duplicate (0x123)
            const tokenA = result.find(t => t.token_address === '0x123');
            expect(tokenA?.protocol).toBe('dex1'); // Not 'Jupiter'
            expect(tokenA?.price_sol).toBe(1.5); // Not 0
        });

        it('should cache the merged results', async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockFetcherService.fetchDexScreenerData.mockResolvedValue(mockDexData);
            mockFetcherService.fetchJupiterData.mockResolvedValue(mockJupData);

            await aggregatorService.getAggregatedData('SOL');

            expect(mockCacheService.set).toHaveBeenCalledWith(
                'tokens_v5:SOL',
                expect.any(String)
            );
        });

        it('should handle empty API responses', async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockFetcherService.fetchDexScreenerData.mockResolvedValue([]);
            mockFetcherService.fetchJupiterData.mockResolvedValue([]);

            const result = await aggregatorService.getAggregatedData('SOL');

            expect(result).toEqual([]);
        });

        it('should handle different query strings', async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockFetcherService.fetchDexScreenerData.mockResolvedValue([]);
            mockFetcherService.fetchJupiterData.mockResolvedValue([]);

            await aggregatorService.getAggregatedData('DOGE');

            expect(mockCacheService.get).toHaveBeenCalledWith('tokens_v5:DOGE');
            expect(mockFetcherService.fetchDexScreenerData).toHaveBeenCalledWith('DOGE');
        });
    });
});
