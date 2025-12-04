# Transaction API Integration Tests

This document provides detailed integration test scenarios for all transaction API endpoints.

## Prerequisites

Before running tests, ensure:

1. Database is initialized:
   ```bash
   npx prisma migrate dev --name initial
   ```

2. Database is seeded (optional but recommended):
   ```bash
   npm run seed
   ```

3. Development server is running:
   ```bash
   npm run dev
   ```

## Test Scenarios

### Scenario 1: Create Account

**Request:**
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Checking Account",
    "type": "checking",
    "currency": "USD"
  }'
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_1",
    "name": "My Checking Account",
    "type": "checking",
    "balance": 0,
    "currency": "USD",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Scenario 2: Create Category

**Request:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Groceries",
    "type": "expense",
    "color": "#ff9800",
    "icon": "shopping-cart"
  }'
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_2",
    "name": "Groceries",
    "type": "expense",
    "color": "#ff9800",
    "icon": "shopping-cart",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Scenario 3: Create Transaction (Income)

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Monthly Salary",
    "amount": 3500.00,
    "type": "income",
    "date": "2024-01-15T09:00:00Z",
    "categoryId": "cuid_salary_category",
    "accountId": "cuid_1"
  }'
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_3",
    "description": "Monthly Salary",
    "amount": 3500,
    "type": "income",
    "date": "2024-01-15T09:00:00.000Z",
    "categoryId": "cuid_salary_category",
    "accountId": "cuid_1",
    "category": { /* category object */ },
    "account": {
      "id": "cuid_1",
      "name": "My Checking Account",
      "type": "checking",
      "balance": 3500,
      "currency": "USD",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Note:** Account balance updated from 0 to 3500

---

### Scenario 4: Create Transaction (Expense)

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Weekly Groceries",
    "amount": 156.50,
    "type": "expense",
    "date": "2024-01-15T14:30:00Z",
    "categoryId": "cuid_2",
    "accountId": "cuid_1"
  }'
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_4",
    "description": "Weekly Groceries",
    "amount": 156.5,
    "type": "expense",
    "date": "2024-01-15T14:30:00.000Z",
    "categoryId": "cuid_2",
    "accountId": "cuid_1",
    "account": {
      "balance": 3343.5
    }
  }
}
```

**Note:** Account balance updated from 3500 to 3343.5

---

### Scenario 5: Get All Transactions

**Request:**
```bash
curl "http://localhost:3000/api/transactions"
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      { /* transaction objects */ }
    ],
    "pagination": {
      "total": 2,
      "limit": 20,
      "offset": 0,
      "pages": 1
    }
  }
}
```

---

### Scenario 6: Filter Transactions by Type

**Request:**
```bash
curl "http://localhost:3000/api/transactions?type=expense&limit=5"
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "type": "expense"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 5,
      "offset": 0,
      "pages": 1
    }
  }
}
```

---

### Scenario 7: Filter Transactions by Date Range

**Request:**
```bash
curl "http://localhost:3000/api/transactions?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z"
```

**Expected Response:** Only transactions within the date range

---

### Scenario 8: Search Transactions by Description

**Request:**
```bash
curl "http://localhost:3000/api/transactions?search=Grocery"
```

**Expected Response:** Transactions with "Grocery" in description

---

### Scenario 9: Update Transaction

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/transactions/cuid_4 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200.00
  }'
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_4",
    "amount": 200,
    "account": {
      "balance": 3300
    }
  }
}
```

**Note:** Account balance adjusted from 3343.5 to 3300

---

### Scenario 10: Update Transaction Type

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/transactions/cuid_4 \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income"
  }'
```

**Expected Response:** Type changed, balance adjusted accordingly

---

### Scenario 11: Delete Transaction

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/transactions/cuid_4
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "message": "Transaction deleted successfully"
  }
}
```

**Note:** Account balance reverts to 3500

---

### Scenario 12: Get Dashboard Stats

**Request:**
```bash
curl "http://localhost:3000/api/dashboard?lastN=10"
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "totalBalance": 3500,
    "totalIncome": 3500,
    "totalExpense": 0,
    "accounts": [ /* account objects */ ],
    "transactions": [ /* last 10 transactions */ ],
    "stats": {
      "accountCount": 1,
      "transactionCount": 1
    }
  }
}
```

---

## Error Scenarios

### Scenario 13: Invalid Validation - Missing Required Field

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "type": "expense"
  }'
```

**Expected Response (Status 400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "amount": ["Amount must be positive"],
    "date": ["Invalid date format"],
    "categoryId": ["Category ID is required"],
    "accountId": ["Account ID is required"]
  }
}
```

---

### Scenario 14: Invalid Amount

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "amount": -50,
    "type": "expense",
    "date": "2024-01-15T10:00:00Z",
    "categoryId": "cuid_2",
    "accountId": "cuid_1"
  }'
```

**Expected Response (Status 400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "amount": ["Amount must be positive"]
  }
}
```

---

### Scenario 15: Non-existent Category

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "amount": 50,
    "type": "expense",
    "date": "2024-01-15T10:00:00Z",
    "categoryId": "non-existent-id",
    "accountId": "cuid_1"
  }'
```

**Expected Response (Status 404):**
```json
{
  "success": false,
  "error": "Category not found"
}
```

---

### Scenario 16: Non-existent Account

**Request:**
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test",
    "amount": 50,
    "type": "expense",
    "date": "2024-01-15T10:00:00Z",
    "categoryId": "cuid_2",
    "accountId": "non-existent-id"
  }'
```

**Expected Response (Status 404):**
```json
{
  "success": false,
  "error": "Account not found"
}
```

---

### Scenario 17: Transaction Not Found

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/transactions/non-existent-id
```

**Expected Response (Status 404):**
```json
{
  "success": false,
  "error": "Transaction not found"
}
```

---

### Scenario 18: Duplicate Category Name

**Request:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Groceries",
    "type": "expense"
  }'
```

(Note: "Groceries" already exists from Scenario 2)

**Expected Response (Status 409):**
```json
{
  "success": false,
  "error": "Category already exists"
}
```

---

## Performance Tests

### Test 1: Large Dataset Query
- Create 1000+ transactions
- Query with pagination: `?limit=100&offset=0`
- Verify response time < 500ms

### Test 2: Complex Filtering
- Query with all filters: `?type=expense&categoryId=X&startDate=...&endDate=...&search=...&limit=50`
- Verify correct filtering and response time < 200ms

### Test 3: Concurrent Requests
- Send 10 concurrent POST requests to create transactions
- Verify all succeed with correct balance updates

---

## Notes

- All timestamps are in UTC
- Amounts are stored as floats with 2 decimal precision
- Account balance updates are atomic (within a single transaction)
- Deleted accounts cascade-delete their transactions
- All dates must be in ISO 8601 format
- Default pagination limit is 20, maximum is 100
