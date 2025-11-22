export interface TokenData {
    token_address: string;
    token_name: string;
    token_ticker: string;
    price_sol: number;
    market_cap_sol: number;
    volume_sol: number;
    liquidity_sol: number;
    transaction_count: number;
    price_1hr_change: number;
    protocol: string;
}

export interface DexScreenerResponse {
    pairs: {
        baseToken: {
            address: string;
            name: string;
            symbol: string;
        };
        priceNative: string;
        liquidity: {
            base: number;
            quote: number;
            usd: number;
        };
        volume: {
            h24: number;
        };
        priceChange: {
            h1: number;
        };
        txns: {
            h24: {
                buys: number;
                sells: number;
            };
        };
        dexId: string;
        fdv: number;
    }[];
}

export interface JupiterResponse {
    address: string;
    name: string;
    symbol: string;
    // Add other fields as needed based on actual API response
}
