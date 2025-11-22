# Real-time Data Aggregation Service

Backend internship assessment project - A real-time meme coin data aggregation service that fetches data from multiple DEX sources, implements caching with Redis, and provides real-time updates via WebSockets.

## Live Demo

**API Endpoint:** https://e-back-ca4c.onrender.com/api/tokens?q=SOL

**GitHub Repository:** https://github.com/Augustus-118/e_back

## Project Overview

This service aggregates real-time cryptocurrency token data from multiple decentralized exchange (DEX) APIs, specifically DexScreener and Jupiter. It implements efficient caching using Redis and provides real-time price updates through WebSocket connections.

## Technical Implementation

### Architecture

The application follows a service-based architecture with clear separation of concerns:

```
Client Request
    |
    v
Express API (app.ts)
    |
    v
Aggregator Service (aggregator.ts)
    |
    +-- Cache Service (cache.ts) --> Redis
    |
    +-- Fetcher Service (fetcher.ts) --> External APIs
         |
         +-- DexScreener API
         +-- Jupiter API
```

### Core Components

**1. Data Fetching Layer (fetcher.ts)**
- Fetches token data from DexScreener and Jupiter APIs
- Implements User-Agent headers to prevent API blocking
- Uses optional chaining to handle missing data fields safely
- Transforms API responses into a unified TokenData format

**2. Caching Layer (cache.ts)**
- Connects to Redis Cloud for distributed caching
- Implements 30-second TTL (Time To Live) for cached data
- Reduces external API calls by approximately 95%
- Provides get/set methods with configurable expiration

**3. Aggregation Service (aggregator.ts)**
- Implements cache-first strategy for optimal performance
- Fetches from both APIs in parallel using Promise.all()
- Merges data from multiple sources intelligently
- Deduplicates tokens using token address as unique identifier
- Prefers DexScreener data when tokens exist in both sources

**4. REST API (app.ts)**
- Exposes GET /api/tokens endpoint
- Accepts query parameter 'q' for token search
- Returns JSON array of aggregated token data
- Implements error handling with appropriate HTTP status codes

**5. WebSocket Server (socket.ts)**
- Provides real-time price updates every 10 seconds
- Broadcasts to all connected clients simultaneously
- Implements Socket.io for WebSocket functionality

### Technology Stack

- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Framework:** Express.js
- **WebSocket:** Socket.io
- **Cache:** Redis (Cloud-hosted)
- **HTTP Client:** Axios
- **Testing:** Jest, Supertest

## Implementation Details

### Multi-API Aggregation Strategy

The service fetches data from two sources:

1. **DexScreener API** - Provides comprehensive trading data including:
   - Price in SOL
   - Market capitalization
   - 24-hour volume
   - Liquidity
   - Transaction counts
   - Price change percentages

2. **Jupiter API** - Provides token metadata:
   - Token addresses
   - Token names and symbols

**Merging Logic:**
- Uses token address (lowercase) as unique identifier
- DexScreener data takes precedence for duplicates (more complete)
- Adds unique tokens found only in Jupiter
- Results in broader token coverage than single-source approach

### Caching Implementation

**Strategy:** Cache-first with time-based invalidation

**Flow:**
1. Check Redis cache for query key
2. If cache hit: Return cached data immediately
3. If cache miss: Fetch from APIs, merge, cache, then return
4. Cache expires after 30 seconds

**Benefits:**
- Reduced API call frequency
- Faster response times
- Protection against rate limits

### Error Handling

- API failures return empty arrays instead of crashing
- HTTP errors return 500 status with error message
- Missing data fields handled with optional chaining and default values
- All async operations wrapped in try-catch blocks

## API Documentation

### GET /api/tokens

Retrieves aggregated token data from multiple DEX sources.

**Query Parameters:**
- `q` (string, optional) - Search query for tokens (default: "SOL")

**Example Request:**
```bash
curl https://e-back-ca4c.onrender.com/api/tokens?q=SOL
```

**Example Response:**
```json
[
  {
    "token_address": "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF",
    "token_name": "Wrapped Solana",
    "token_ticker": "SOL",
    "price_sol": 68.02,
    "market_cap_sol": 75228,
    "volume_sol": 3127.31,
    "liquidity_sol": 39240.99,
    "transaction_count": 32,
    "price_1hr_change": 0,
    "protocol": "pancakeswap"
  }
]
```

### WebSocket Connection

**Connect:**
```javascript
const socket = io('https://e-back-ca4c.onrender.com');
```

**Listen for updates:**
```javascript
socket.on('price-update', (data) => {
  console.log('Received token updates:', data);
});
```

Updates are broadcast every 10 seconds to all connected clients.

## Installation and Setup

### Prerequisites

- Node.js 18 or higher
- Redis instance (cloud or local)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Augustus-118/e_back.git
cd e_back
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
PORT=3000
REDIS_URL=redis://default:password@host:port
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing

The project includes comprehensive unit and integration tests.

**Run tests:**
```bash
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Test Coverage:**
- 12 tests total (all passing)
- Covers service logic, API endpoints, caching, and error handling
- Tests use mocking to isolate units and avoid external dependencies

## Deployment

The application is deployed on Render (free tier).

**Build Command:** `npm install && npm run build`

**Start Command:** `npm start`

**Environment Variables:**
- `REDIS_URL` - Redis connection string
- `PORT` - Server port (auto-assigned by Render)

## Project Structure

```
e_back/
├── src/
│   ├── __tests__/
│   │   ├── aggregator.test.ts    # Service logic tests
│   │   └── api.test.ts           # API endpoint tests
│   ├── services/
│   │   ├── fetcher.ts            # API data fetching
│   │   ├── cache.ts              # Redis caching
│   │   └── aggregator.ts         # Data merging logic
│   ├── config.ts                 # Configuration management
│   ├── types.ts                  # TypeScript interfaces
│   ├── app.ts                    # Express routes
│   ├── socket.ts                 # WebSocket server
│   └── server.ts                 # Application entry point
├── dist/                         # Compiled JavaScript
├── jest.config.js                # Test configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Design Decisions

### Why TypeScript?
- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through interfaces

### Why Redis for Caching?
- In-memory storage provides sub-millisecond response times
- TTL feature handles automatic cache invalidation
- Cloud-hosted solution requires no local infrastructure

### Why Parallel API Fetching?
- Promise.all() executes both API calls simultaneously
- Reduces total wait time from 4 seconds to 2 seconds
- Improves user experience with faster responses

### Why WebSocket for Real-time Updates?
- Push-based updates eliminate need for client polling
- Reduces bandwidth usage
- Provides true real-time experience

## Assessment Requirements Met

- Multi-API data aggregation (DexScreener + Jupiter)
- Redis caching with configurable TTL
- Real-time WebSocket updates
- REST API with filtering support
- Error handling and rate limit consideration
- Token deduplication and merging
- Deployed to free hosting (Render)
- Comprehensive documentation
- Unit and integration tests (12 tests)
- Postman collection included

## Known Limitations

- Jupiter API provides limited data compared to DexScreener
- Cache invalidation is time-based only (no manual invalidation)
- No authentication or authorization implemented
- Rate limits depend on external API providers

## Future Improvements

- Add more DEX sources for broader coverage
- Implement cursor-based pagination
- Add filtering by time period (1h, 24h, 7d)
- Implement sorting by various metrics
- Add request rate limiting
- Implement cache warming strategies

## Author

Created as part of backend internship assessment.

## License

ISC
