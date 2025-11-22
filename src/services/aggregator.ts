import { fetcherService } from './fetcher';
import { cacheService } from './cache';
import { TokenData } from '../types';

export class AggregatorService {
    async getAggregatedData(query: string): Promise<TokenData[]> {
        const cacheKey = `tokens_v5:${query}`;
        const cachedData = await cacheService.get(cacheKey);

        if (cachedData) {
            console.log('Returning cached data');
            return JSON.parse(cachedData);
        }

        console.log('Cache miss, fetching fresh data from both APIs');

        // Fetch from BOTH APIs in parallel (faster!)
        const [dexData, jupData] = await Promise.all([
            fetcherService.fetchDexScreenerData(query),
            fetcherService.fetchJupiterData(query)
        ]);

        console.log(`Received ${dexData.length} tokens from DexScreener, ${jupData.length} from Jupiter`);

        // MERGE LOGIC: Combine data from both sources
        const mergedTokens = this.mergeTokenData(dexData, jupData);

        console.log(`After merging: ${mergedTokens.length} unique tokens`);

        await cacheService.set(cacheKey, JSON.stringify(mergedTokens));
        return mergedTokens;
    }

    /**
     * Merges token data from multiple sources
     * Strategy:
     * 1. Use token_address as the unique identifier
     * 2. If same token exists in both APIs, prefer DexScreener data (more complete)
     * 3. Add tokens that only exist in Jupiter
     */
    private mergeTokenData(dexData: TokenData[], jupData: TokenData[]): TokenData[] {
        // Step 1: Create a Map with token_address as key
        const tokenMap = new Map<string, TokenData>();

        // Step 2: Add all DexScreener tokens (they have more data)
        dexData.forEach(token => {
            if (token.token_address) {
                tokenMap.set(token.token_address.toLowerCase(), token);
            }
        });

        // Step 3: Add Jupiter tokens ONLY if they don't exist in DexScreener
        jupData.forEach(token => {
            if (token.token_address) {
                const address = token.token_address.toLowerCase();

                // If token already exists from DexScreener, we could enrich it
                if (tokenMap.has(address)) {
                    // Optional: Merge additional data from Jupiter
                    // For now, we keep DexScreener data as it's more complete
                    console.log(`Token ${token.token_ticker} found in both APIs, using DexScreener data`);
                } else {
                    // New token only in Jupiter, add it
                    tokenMap.set(address, token);
                }
            }
        });

        // Step 4: Convert Map back to array
        return Array.from(tokenMap.values());
    }
}

export const aggregatorService = new AggregatorService();
