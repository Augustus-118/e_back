import axios from 'axios';
import { config } from '../config';
import { DexScreenerResponse, TokenData } from '../types';

export class FetcherService {
    async fetchDexScreenerData(query: string): Promise<TokenData[]> {
        try {
            console.log(`Fetching DexScreener data for query: ${query}`);
            const response = await axios.get<DexScreenerResponse>(`${config.dexScreenerApi}/search?q=${query}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            console.log(`DexScreener response status: ${response.status}`);

            if (response.data && response.data.pairs) {
                console.log(`Found ${response.data.pairs.length} pairs from DexScreener`);
                return response.data.pairs.map((pair) => ({
                    token_address: pair.baseToken?.address || '',
                    token_name: pair.baseToken?.name || '',
                    token_ticker: pair.baseToken?.symbol || '',
                    price_sol: parseFloat(pair.priceNative || '0'),
                    market_cap_sol: pair.fdv || 0,
                    volume_sol: pair.volume?.h24 || 0,
                    liquidity_sol: pair.liquidity?.usd || 0,
                    transaction_count: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
                    price_1hr_change: pair.priceChange?.h1 || 0,
                    protocol: pair.dexId || '',
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching DexScreener data:', error);
            return [];
        }
    }

    // Jupiter API - fetches token data from Jupiter aggregator
    async fetchJupiterData(query: string): Promise<TokenData[]> {
        try {
            console.log(`Fetching Jupiter data for query: ${query}`);
            const response = await axios.get(`${config.jupiterApi}?query=${query}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            console.log(`Jupiter response status: ${response.status}`);

            // Jupiter API returns different structure, transform to our format
            if (response.data && Array.isArray(response.data)) {
                console.log(`Found ${response.data.length} tokens from Jupiter`);
                return response.data.map((token: any) => ({
                    token_address: token.address || '',
                    token_name: token.name || '',
                    token_ticker: token.symbol || '',
                    price_sol: 0, // Jupiter doesn't provide price in SOL directly
                    market_cap_sol: 0,
                    volume_sol: 0,
                    liquidity_sol: 0,
                    transaction_count: 0,
                    price_1hr_change: 0,
                    protocol: 'Jupiter',
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching Jupiter data:', error);
            return [];
        }
    }
}

export const fetcherService = new FetcherService();
