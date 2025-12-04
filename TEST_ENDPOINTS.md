# Testing Transaction APIs

## Quick Start

1. Ensure database is migrated:
```bash
npx prisma migrate dev --name initial
```

2. Seed the database (optional):
```bash
npm run seed
```

3. Start the development server:
```bash
npm run dev
```

4. Run the tests with curl or your preferred HTTP client

## Example Test Requests

### 1. Get Accounts
```bash
curl http://localhost:3000/api/accounts
```

### 2. Get Categories
```bash
curl "http://localhost:3000/api/categories?type=expense"
```

### 3. Get Transactions with Filters
```bash
curl "http://localhost:3000/api/transactions"
curl "http://localhost:3000/api/transactions?type=expense&limit=5"
curl "http://localhost:3000/api/transactions?search=grocery"
```

### 4. Create a Transaction
First, get an account ID and category ID:
```bash
ACCOUNT_ID=$(curl -s http://localhost:3000/api/accounts | jq -r '.data.accounts[0].id')
CATEGORY_ID=$(curl -s http://localhost:3000/api/categories | jq -r '.data.categories[0].id')

curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{
    \"description\": \"Test transaction\",
    \"amount\": 50.25,
    \"type\": \"expense\",
    \"date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"categoryId\": \"$CATEGORY_ID\",
    \"accountId\": \"$ACCOUNT_ID\"
  }"
```

### 5. Update a Transaction
```bash
TRANSACTION_ID=$(curl -s http://localhost:3000/api/transactions | jq -r '.data.transactions[0].id')

curl -X PATCH http://localhost:3000/api/transactions/$TRANSACTION_ID \
  -H "Content-Type: application/json" \
  -d '{"amount": 75.50}'
```

### 6. Delete a Transaction
```bash
curl -X DELETE http://localhost:3000/api/transactions/$TRANSACTION_ID
```

### 7. Get Dashboard Stats
```bash
curl "http://localhost:3000/api/dashboard?lastN=10"
```

## Expected Responses

All endpoints return JSON in this format:
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "errors": { /* validation errors */ }
}
```

## Notes

- All amounts are stored as floats with 2 decimal precision
- Transaction types must be "income" or "expense"
- Account balance is automatically updated when transactions change
- Dates should be in ISO 8601 format
- Pagination: use `limit` and `offset` parameters
- Maximum limit is 100, default is 20
