# Transaction API Testing Guide

This document provides manual testing instructions for the transaction APIs.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Migrate the database:
   ```bash
   npx prisma migrate dev --name initial
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Accounts API

#### GET /api/accounts
Lists all accounts.

**Response:**
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "account-id",
        "name": "Checking Account",
        "type": "checking",
        "balance": 5000,
        "currency": "USD",
        "transactionCount": 5,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### POST /api/accounts
Create a new account.

**Request Body:**
```json
{
  "name": "Savings Account",
  "type": "savings",
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-account-id",
    "name": "Savings Account",
    "type": "savings",
    "balance": 0,
    "currency": "USD",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Categories API

#### GET /api/categories
Lists all categories. Optionally filter by type.

**Query Parameters:**
- `type` (optional): "income" or "expense"

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category-id",
        "name": "Salary",
        "type": "income",
        "color": "#10b981",
        "icon": "trending-up",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

#### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "name": "Healthcare",
  "type": "expense",
  "color": "#ef4444",
  "icon": "heart"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-category-id",
    "name": "Healthcare",
    "type": "expense",
    "color": "#ef4444",
    "icon": "heart",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Transactions API

#### GET /api/transactions
Lists all transactions with optional filters.

**Query Parameters:**
- `type` (optional): "income" or "expense"
- `categoryId` (optional): Filter by category ID
- `startDate` (optional): ISO 8601 format (e.g., 2024-01-01T00:00:00Z)
- `endDate` (optional): ISO 8601 format
- `search` (optional): Search description by text
- `limit` (optional): Maximum 100, default 20
- `offset` (optional): Pagination offset, default 0

**Example:**
```
GET /api/transactions?type=expense&limit=10&offset=0
GET /api/transactions?categoryId=abc123&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "transaction-id",
        "description": "Grocery shopping",
        "amount": 156.50,
        "type": "expense",
        "date": "2024-01-01T12:00:00.000Z",
        "categoryId": "category-id",
        "accountId": "account-id",
        "category": {
          "id": "category-id",
          "name": "Food & Dining",
          "type": "expense",
          "color": "#f59e0b",
          "icon": "utensils"
        },
        "account": {
          "id": "account-id",
          "name": "Checking Account",
          "type": "checking",
          "balance": 5000,
          "currency": "USD"
        },
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 42,
      "limit": 20,
      "offset": 0,
      "pages": 3
    }
  }
}
```

#### POST /api/transactions
Create a new transaction.

**Request Body:**
```json
{
  "description": "Weekly groceries",
  "amount": 156.50,
  "type": "expense",
  "date": "2024-01-15T10:30:00Z",
  "categoryId": "category-id",
  "accountId": "account-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-transaction-id",
    "description": "Weekly groceries",
    "amount": 156.50,
    "type": "expense",
    "date": "2024-01-15T10:30:00.000Z",
    "categoryId": "category-id",
    "accountId": "account-id",
    "category": { ... },
    "account": { ... },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

Note: Account balance is automatically updated when a transaction is created.

#### PATCH /api/transactions/[id]
Update an existing transaction.

**Request Body (all optional):**
```json
{
  "description": "Updated description",
  "amount": 200.00,
  "type": "income",
  "date": "2024-01-16T10:30:00Z",
  "categoryId": "new-category-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* Updated transaction */ }
}
```

Note: Account balance is automatically adjusted when amount or type changes.

#### DELETE /api/transactions/[id]
Delete a transaction.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Transaction deleted successfully"
  }
}
```

Note: Account balance is automatically adjusted when a transaction is deleted.

### Dashboard API

#### GET /api/dashboard
Get dashboard overview with aggregated stats and last N transactions.

**Query Parameters:**
- `lastN` (optional): Number of recent transactions to include (max 100, default 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBalance": 18000.50,
    "totalIncome": 4300.00,
    "totalExpense": 211.49,
    "accounts": [
      { /* Account objects */ }
    ],
    "transactions": [
      { /* Last N transactions */ }
    ],
    "stats": {
      "accountCount": 3,
      "transactionCount": 10
    }
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "description": ["Description is required"],
    "amount": ["Amount must be positive"]
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Category not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "error": "Category already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing with cURL

### Create an Account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Account","type":"checking","currency":"USD"}'
```

### Create a Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","type":"expense","color":"#f59e0b","icon":"utensils"}'
```

### Create a Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description":"Lunch",
    "amount":25.50,
    "type":"expense",
    "date":"2024-01-15T12:00:00Z",
    "categoryId":"CATEGORY_ID",
    "accountId":"ACCOUNT_ID"
  }'
```

### List Transactions with Filters
```bash
curl "http://localhost:3000/api/transactions?type=expense&limit=5"
```

### Update a Transaction
```bash
curl -X PATCH http://localhost:3000/api/transactions/TRANSACTION_ID \
  -H "Content-Type: application/json" \
  -d '{"amount":30.00}'
```

### Delete a Transaction
```bash
curl -X DELETE http://localhost:3000/api/transactions/TRANSACTION_ID
```

### Get Dashboard Stats
```bash
curl "http://localhost:3000/api/dashboard?lastN=10"
```

## Data Validation

### Amount Validation
- Must be a positive number
- Stored as Float (2 decimal places)
- Example: 156.50, 0.99

### Date Validation
- Must be ISO 8601 format
- Example: "2024-01-15T10:30:00Z" or "2024-01-15T10:30:00+00:00"

### Type Validation
- Transaction type must be "income" or "expense"
- Category type must be "income" or "expense"

### Color Validation
- Must be valid hex color code
- Format: #RRGGBB
- Example: #f59e0b

### Account Type Validation
- Must be one of: "checking", "savings", "credit"

## Notes

- Account balance is automatically updated when transactions are created, updated, or deleted
- Income increases account balance, expenses decrease it
- All timestamps are in UTC
- Pagination uses limit and offset (not page-based)
- Deleted accounts cascade delete their transactions
- Transaction amounts are stored as Float with 2 decimal precision
