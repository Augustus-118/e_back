# 🧪 Testing Guide

This guide explains how to test the API and understand the unit tests.

## 📋 Table of Contents

1. [Manual API Testing](#manual-api-testing)
2. [Understanding Unit Tests](#understanding-unit-tests)
3. [Running Tests](#running-tests)
4. [Test Coverage](#test-coverage)

---

## 🌐 Manual API Testing

### Using curl (Command Line)

**Test the live API:**
```bash
# Get SOL tokens
curl https://e-back-ca4c.onrender.com/api/tokens?q=SOL

# Get DOGE tokens
curl https://e-back-ca4c.onrender.com/api/tokens?q=DOGE

# Default query (SOL)
curl https://e-back-ca4c.onrender.com/api/tokens
```

### Using Browser

Just visit these URLs:
- https://e-back-ca4c.onrender.com/api/tokens?q=SOL
- https://e-back-ca4c.onrender.com/api/tokens?q=PEPE

### Using Postman

1. Import `postman_collection.json`
2. Update the `base_url` variable to: `https://e-back-ca4c.onrender.com`
3. Run the requests

### Using JavaScript (Frontend)

```javascript
fetch('https://e-back-ca4c.onrender.com/api/tokens?q=SOL')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## 🧪 Understanding Unit Tests

### What Are Unit Tests?

Unit tests verify that individual pieces of code (functions, classes) work correctly in isolation.

**Benefits:**
- ✅ Catch bugs early
- ✅ Document how code should behave
- ✅ Make refactoring safer
- ✅ Improve code quality

### Test Structure

Every test follows this pattern:

```typescript
describe('What you're testing', () => {
  it('should do something specific', () => {
    // Arrange: Set up test data
    const input = 'SOL';
    
    // Act: Call the function
    const result = someFunction(input);
    
    // Assert: Check the result
    expect(result).toBe(expected);
  });
});
```

### Our Test Files

#### 1. **aggregator.test.ts** - Service Logic Tests

**What it tests:**
- ✅ Caching works correctly
- ✅ Data merging from multiple APIs
- ✅ Deduplication logic
- ✅ Edge cases (empty data, errors)

**Example Test:**
```typescript
it('should return cached data if available', async () => {
  // Mock: Pretend cache has data
  mockCacheService.get.mockResolvedValue(cachedData);
  
  // Call the function
  const result = await aggregatorService.getAggregatedData('SOL');
  
  // Verify: Should return cached data without calling APIs
  expect(result).toEqual(mockData);
  expect(mockFetcherService.fetchDexScreenerData).not.toHaveBeenCalled();
});
```

**Why this test matters:**
- Ensures caching works (saves API calls)
- Verifies we don't waste time fetching when data exists

#### 2. **api.test.ts** - API Endpoint Tests

**What it tests:**
- ✅ HTTP endpoints return correct status codes
- ✅ Query parameters work
- ✅ Error handling
- ✅ Response format

**Example Test:**
```typescript
it('should return 200 and token data', async () => {
  // Mock the service
  mockAggregatorService.getAggregatedData.mockResolvedValue(mockTokens);
  
  // Make HTTP request
  const response = await request(app)
    .get('/api/tokens')
    .query({ q: 'SOL' });
  
  // Verify response
  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockTokens);
});
```

**Why this test matters:**
- Ensures API works as expected
- Catches breaking changes to endpoints

### Key Testing Concepts

#### 1. **Mocking**

**What:** Replace real dependencies with fake ones

**Why:** Test in isolation without external dependencies

```typescript
// Mock the cache service
jest.mock('../services/cache');

// Now we control what it returns
mockCacheService.get.mockResolvedValue('fake data');
```

#### 2. **Assertions**

**What:** Check if results match expectations

```typescript
expect(result).toBe(5);              // Exact match
expect(result).toEqual(object);      // Deep equality
expect(result).toHaveLength(3);      // Array/string length
expect(fn).toHaveBeenCalled();       // Function was called
expect(fn).toHaveBeenCalledWith(x);  // Called with specific args
```

#### 3. **Async Testing**

**What:** Test asynchronous code (promises, async/await)

```typescript
it('should fetch data', async () => {
  const result = await fetchData();  // Wait for promise
  expect(result).toBeDefined();
});
```

---

## 🚀 Running Tests

### Run All Tests

```bash
npm test
```

**Output:**
```
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Time:        11.254 s
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

**What it does:**
- Watches for file changes
- Re-runs tests automatically
- Great for development!

### Run with Coverage

```bash
npm run test:coverage
```

**What it shows:**
- % of code covered by tests
- Which lines aren't tested
- Helps identify gaps

**Example Output:**
```
File                | % Stmts | % Branch | % Funcs | % Lines
--------------------|---------|----------|---------|--------
aggregator.ts       |   95.2  |   88.9   |  100.0  |  95.2
api.ts              |   90.0  |   75.0   |  100.0  |  90.0
```

---

## 📊 Test Coverage

### What We Test

**✅ Aggregator Service (6 tests)**
1. Returns cached data when available
2. Fetches from APIs on cache miss
3. Merges data from multiple sources correctly
4. Deduplicates tokens by address
5. Caches merged results
6. Handles empty API responses

**✅ API Endpoints (6 tests)**
1. Returns 200 with token data
2. Uses default query when missing
3. Returns empty array for no results
4. Handles errors gracefully (500 status)
5. Accepts different query parameters
6. Returns JSON content type

### Edge Cases Covered

- ✅ Empty API responses
- ✅ Cache hits and misses
- ✅ Duplicate tokens
- ✅ Missing query parameters
- ✅ API errors
- ✅ Different query strings

---

## 🎓 How to Write Your Own Tests

### Step 1: Identify What to Test

Ask yourself:
- What should this function do?
- What inputs will it receive?
- What should it return?
- What can go wrong?

### Step 2: Write the Test

```typescript
describe('MyFunction', () => {
  it('should return sum of two numbers', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });
  
  it('should handle negative numbers', () => {
    const result = add(-2, 3);
    expect(result).toBe(1);
  });
});
```

### Step 3: Run and Fix

```bash
npm test
```

If it fails, fix your code or test until it passes!

---

## 🐛 Common Testing Mistakes

### ❌ Not Mocking Dependencies

```typescript
// BAD: Uses real Redis
const result = await aggregatorService.getAggregatedData('SOL');
```

```typescript
// GOOD: Mocks Redis
jest.mock('../services/cache');
mockCacheService.get.mockResolvedValue(null);
```

### ❌ Not Testing Edge Cases

```typescript
// BAD: Only tests happy path
it('should return data', async () => {
  const result = await fetchData('SOL');
  expect(result).toBeDefined();
});
```

```typescript
// GOOD: Tests edge cases too
it('should handle empty query', async () => {
  const result = await fetchData('');
  expect(result).toEqual([]);
});
```

### ❌ Not Cleaning Up

```typescript
// BAD: Tests affect each other
let data = [];
it('test 1', () => { data.push(1); });
it('test 2', () => { expect(data).toEqual([1]); }); // Fails!
```

```typescript
// GOOD: Clean state for each test
beforeEach(() => {
  data = [];
});
```

---

## 📚 Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

---

## ✅ Test Checklist

Before submitting:
- [ ] All tests pass (`npm test`)
- [ ] Coverage > 70% (`npm run test:coverage`)
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests cover error handling
- [ ] No console errors in test output

---

**You now have 12 passing tests covering:**
- ✅ Service logic
- ✅ API endpoints
- ✅ Caching
- ✅ Data merging
- ✅ Error handling
- ✅ Edge cases

Great job! 🎉
