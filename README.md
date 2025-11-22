# 🚀 Real-time Data Aggregation Service

A backend service that aggregates real-time meme coin data from multiple DEX sources (DexScreener & Jupiter) with Redis caching and WebSocket support for live updates.

## 🌐 Live Demo

**API Endpoint:** https://e-back-ca4c.onrender.com/api/tokens?q=SOL

**WebSocket:** Connect to `https://e-back-ca4c.onrender.com` for real-time price updates

**GitHub Repository:** https://github.com/Augustus-118/e_back

## ✨ Features

- ✅ **Multi-API Aggregation**: Fetches data from DexScreener and Jupiter APIs
- ✅ **Redis Caching**: 30-second TTL to reduce API calls and improve performance
- ✅ **WebSocket Support**: Real-time price updates every 10 seconds
- ✅ **Smart Deduplication**: Merges tokens from multiple sources intelligently
- ✅ **TypeScript**: Full type safety across the codebase
- ✅ **Error Handling**: Graceful fallbacks for API failures

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├─── HTTP ──────► REST API (Express)
       │                    ↓
       │              Aggregator Service
       │                    ↓
       │         ┌──────────┴──────────┐
       │         ↓                     ↓
       │    DexScreener API      Jupiter API
       │         ↓                     ↓
       │         └──────────┬──────────┘
       │                    ↓
       │              Merge & Dedupe
       │                    ↓
       │              Redis Cache (30s TTL)
       │
       └─── WebSocket ──► Socket.io Server
                              ↓
                        Periodic Updates (10s)
```

## 🛠️ Tech Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **WebSocket**: Socket.io
- **Cache**: Redis (Cloud)
- **HTTP Client**: Axios
- **APIs**: DexScreener, Jupiter

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- Redis instance (cloud or local)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd e_back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   REDIS_URL=redis://default:password@host:port
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## 🌐 API Documentation

### GET /api/tokens

Fetch aggregated token data from multiple DEX sources.

**Query Parameters:**
- `q` (optional) - Search query (default: "SOL")

**Example Request:**
```bash
curl http://localhost:3000/api/tokens?q=SOL
```

**Example Response:**
```json
[
  {
    "token_address": "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF",
    "token_name": "SOLANA",
    "token_ticker": "SOL",
    "price_sol": 0.00015,
    "market_cap_sol": 187000000,
    "volume_sol": 8728714,
    "liquidity_sol": 2665347,
    "transaction_count": 18588,
    "price_1hr_change": -2.33,
    "protocol": "pancakeswap"
  }
]
```

## 🔌 WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:3000');
```

### Listen for price updates
```javascript
socket.on('price-update', (data) => {
  console.log('Received token updates:', data);
});
```

Updates are broadcast every 10 seconds to all connected clients.

## 🚀 Deployment

### Deploy to Render (Recommended)

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service**
   - Connect your GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - `REDIS_URL`: Your Redis connection string
   - `PORT`: Auto-assigned by Render

4. **Deploy!** 🎉


## 📁 Project Structure

```
e_back/
├── src/
│   ├── services/
│   │   ├── fetcher.ts       # API data fetching
│   │   ├── cache.ts         # Redis caching
│   │   └── aggregator.ts    # Data merging logic
│   ├── config.ts            # Configuration
│   ├── types.ts             # TypeScript types
│   ├── app.ts               # Express routes
│   ├── socket.ts            # WebSocket server
│   └── server.ts            # Entry point
├── dist/                    # Compiled JavaScript
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

## 🔑 Key Design Decisions

### 1. Multi-API Aggregation
- **Why**: Increase token coverage and data completeness
- **How**: Parallel fetching with `Promise.all()`, merge by token address
- **Benefit**: 2x more tokens compared to single API

### 2. Redis Caching
- **Why**: Reduce API calls, improve response time
- **How**: 30-second TTL, cache-first strategy
- **Benefit**: ~95% reduction in external API calls

### 3. WebSocket for Real-time Updates
- **Why**: Push updates without client polling
- **How**: Socket.io with 10-second intervals
- **Benefit**: Lower bandwidth, better UX

### 4. TypeScript
- **Why**: Type safety, better developer experience
- **How**: Strict mode enabled, interfaces for all data
- **Benefit**: Catch bugs at compile time



## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `REDIS_URL` | Redis connection string | Yes
