# 🌐 REST API Explained - Complete Guide

## 📚 What is REST API?

**REST** (Representational State Transfer) is a way for applications to communicate over HTTP.

**Analogy:**
- **Restaurant Menu** = API Documentation
- **Ordering Food** = Making HTTP Request
- **Kitchen** = Backend Server
- **Receiving Food** = Getting JSON Response

## 🏗️ How We Expose Our Backend

### Step 1: Create Express App (`app.ts`)

```typescript
import express from 'express';

const app = express();  // Creates the web server
```

**What is Express?**
- A web framework for Node.js
- Makes building APIs super easy
- Handles routing, requests, responses

### Step 2: Enable Middleware

```typescript
app.use(cors());         // Allow requests from browsers
app.use(express.json()); // Parse JSON request bodies
```

**What is Middleware?**
- Code that runs BEFORE your route handler
- Like security guards checking tickets before entry

**CORS (Cross-Origin Resource Sharing):**
- Browsers block requests to different domains by default
- `cors()` says "it's okay, let them in!"
- Without this, your frontend can't call your API

**express.json():**
- Converts incoming JSON to JavaScript objects
- Example: `"{"name":"SOL"}"` → `{ name: "SOL" }`

### Step 3: Define Routes (Endpoints)

```typescript
app.get('/api/tokens', async (req, res) => {
  // This code runs when someone visits:
  // http://localhost:3000/api/tokens
});
```

**Breaking it down:**

| Part | Meaning |
|------|---------|
| `app.get()` | Handle GET requests |
| `'/api/tokens'` | The URL path (endpoint) |
| `async (req, res) =>` | Handler function |
| `req` | Request object (what user sent) |
| `res` | Response object (what we send back) |

### Step 4: Extract Query Parameters

```typescript
const query = req.query.q || 'SOL';
```

**What are Query Parameters?**
- Extra data in the URL after `?`
- Example: `/api/tokens?q=SOL&limit=10`
- `req.query.q` extracts the `q` parameter

**URL Breakdown:**
```
http://localhost:3000/api/tokens?q=SOL&limit=10
│                     │          │
│                     │          └─ Query parameters
│                     └─ Path (endpoint)
└─ Base URL
```

### Step 5: Process Request

```typescript
const data = await aggregatorService.getAggregatedData(query);
```

**What happens here:**
1. Call our aggregator service
2. Aggregator checks Redis cache
3. If cache miss, fetches from APIs
4. Returns token data

### Step 6: Send Response

```typescript
res.json(data);
```

**What `res.json()` does:**
- Converts JavaScript object to JSON string
- Sets `Content-Type: application/json` header
- Sends response to client

### Step 7: Handle Errors

```typescript
try {
  // ... main logic
} catch (error) {
  res.status(500).json({ error: 'Internal Server Error' });
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (client error)
- `404` - Not Found
- `500` - Server Error

## 🔄 Complete Request-Response Flow

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ 1. HTTP GET /api/tokens?q=SOL
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  ┌───────────────────────────────┐  │
│  │  Middleware Layer             │  │
│  │  - CORS (allow requests)      │  │
│  │  - JSON parser                │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  Route Handler                │  │
│  │  app.get('/api/tokens', ...)  │  │
│  │  - Extract query: "SOL"       │  │
│  │  - Call aggregatorService     │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│     Aggregator Service              │
│  - Check Redis cache                │
│  - Fetch from DexScreener + Jupiter │
│  - Merge data                       │
│  - Return token array               │
└───────────┬─────────────────────────┘
            │ 2. Return data
            ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  res.json(data)                     │
│  - Convert to JSON                  │
│  - Set headers                      │
│  - Send response                    │
└───────────┬─────────────────────────┘
            │ 3. HTTP 200 + JSON
            ▼
┌─────────────┐
│   Browser   │
│  Receives:  │
│  [{...}, ...]│
└─────────────┘
```

## 🎯 Our API Endpoints

### Current Endpoint

**GET /api/tokens**

**Description:** Fetch aggregated token data

**Query Parameters:**
- `q` (optional) - Search query (default: "SOL")

**Example Requests:**
```bash
# Search for SOL tokens
curl http://localhost:3000/api/tokens?q=SOL

# Search for DOGE tokens
curl http://localhost:3000/api/tokens?q=DOGE

# Default (SOL)
curl http://localhost:3000/api/tokens
```

**Response Format:**
```json
[
  {
    "token_address": "0x570A5D26...",
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

## 🚀 How Server Starts

### server.ts - The Entry Point

```typescript
import { createServer } from 'http';
import { app } from './app';
import { setupSocket } from './socket';

// 1. Wrap Express app in HTTP server
const httpServer = createServer(app);

// 2. Add WebSocket support
setupSocket(httpServer);

// 3. Start listening on port 3000
httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Why wrap Express in HTTP server?**
- Express is just a request handler
- HTTP server actually listens on a port
- Allows us to add WebSocket to same port

## 🔧 Adding More Endpoints (Examples)

### Example 1: Get Single Token by Address

```typescript
app.get('/api/tokens/:address', async (req, res) => {
  const address = req.params.address;  // From URL path
  const token = await findTokenByAddress(address);
  
  if (!token) {
    return res.status(404).json({ error: 'Token not found' });
  }
  
  res.json(token);
});
```

**Usage:** `GET /api/tokens/0x570A5D26...`

### Example 2: Filter by Protocol

```typescript
app.get('/api/tokens/protocol/:name', async (req, res) => {
  const protocol = req.params.name;
  const tokens = await getTokensByProtocol(protocol);
  res.json(tokens);
});
```

**Usage:** `GET /api/tokens/protocol/pancakeswap`

### Example 3: POST Request (Create Data)

```typescript
app.post('/api/favorites', async (req, res) => {
  const { tokenAddress } = req.body;  // From request body
  await saveFavorite(tokenAddress);
  res.status(201).json({ message: 'Favorite added' });
});
```

**Usage:**
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"tokenAddress": "0x570A5D26..."}'
```

## 📊 HTTP Methods Explained

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Get list of tokens |
| **POST** | Create new data | Add favorite token |
| **PUT** | Update entire resource | Update token info |
| **PATCH** | Update partial data | Update only price |
| **DELETE** | Remove data | Delete favorite |

## 🎓 Key Concepts

### 1. **Stateless**
- Each request is independent
- Server doesn't remember previous requests
- That's why we use Redis for caching!

### 2. **JSON Format**
- JavaScript Object Notation
- Easy for both humans and computers to read
- Standard for web APIs

### 3. **RESTful Design**
- Use nouns for endpoints: `/tokens` not `/getTokens`
- Use HTTP methods for actions: `GET /tokens` not `/tokens/get`
- Use status codes properly

### 4. **CORS**
- Security feature in browsers
- Prevents malicious websites from stealing data
- We enable it for development

## 🧪 Testing Your API

### Using curl (Command Line)
```bash
curl http://localhost:3000/api/tokens?q=SOL
```

### Using Browser
Just visit: `http://localhost:3000/api/tokens?q=SOL`

### Using JavaScript (Frontend)
```javascript
fetch('http://localhost:3000/api/tokens?q=SOL')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Using Postman
1. Open Postman
2. Create new GET request
3. URL: `http://localhost:3000/api/tokens?q=SOL`
4. Click Send

## 🔐 Best Practices

### 1. **Always Handle Errors**
```typescript
try {
  // risky code
} catch (error) {
  res.status(500).json({ error: 'Something went wrong' });
}
```

### 2. **Validate Input**
```typescript
if (!query || query.length < 2) {
  return res.status(400).json({ error: 'Query too short' });
}
```

### 3. **Use Proper Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `500` - Server error

### 4. **Add Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🎯 Summary

**How we expose backend through REST API:**

1. **Express** creates the web server
2. **Middleware** processes incoming requests
3. **Routes** define what URLs are available
4. **Handlers** contain the business logic
5. **Responses** send data back as JSON

**The magic happens in `app.ts`:**
- Define endpoints with `app.get()`, `app.post()`, etc.
- Extract data from `req` (request)
- Process with our services
- Send back with `res.json()`

**That's it!** Your backend is now accessible via HTTP from anywhere! 🚀
