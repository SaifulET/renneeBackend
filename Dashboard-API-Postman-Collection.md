# Dashboard API - Postman Collection

## Base URL

```
{{BASE_URL}}/api/dashboard
```

## Authentication

All endpoints require Bearer token authentication with admin or superadmin role.

**Headers:**

```
Authorization: Bearer <your_admin_token>
Content-Type: application/json
```

---

## 1. Get Dashboard Statistics

**Endpoint:** `GET /api/dashboard/get-stats`

**Description:** Retrieves overall dashboard statistics including total products, orders, customers, and collections.

**Headers:**

```
Authorization: Bearer <your_admin_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "summary": {
      "totalProducts": 24780,
      "totalOrders": 1245,
      "totalCustomers": 845,
      "totalCollections": 15
    },
    "recentOrders": [...],
    "topSellingProducts": [...]
  },
  "error": null
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin/superadmin)
- `500` - Internal Server Error

---

## 2. Get User Growth Data

**Endpoint:** `GET /api/dashboard/user-growth`

**Description:** Retrieves monthly user growth data for a specific year.

**Headers:**

```
Authorization: Bearer <your_admin_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | number | Yes | Year for which to fetch user growth data |

**Example Request:**

```
GET /api/dashboard/user-growth?year=2026
```

**Response:**

```json
{
  "success": true,
  "message": "User growth data retrieved successfully",
  "data": {
    "year": 2026,
    "totalUsers": 845,
    "monthlyData": [
      { "month": "Jan", "totalUsers": 45 },
      { "month": "Feb", "totalUsers": 62 },
      { "month": "Mar", "totalUsers": 78 },
      { "month": "Apr", "totalUsers": 91 },
      { "month": "May", "totalUsers": 85 },
      { "month": "Jun", "totalUsers": 103 },
      { "month": "Jul", "totalUsers": 95 },
      { "month": "Aug", "totalUsers": 87 },
      { "month": "Sep", "totalUsers": 76 },
      { "month": "Oct", "totalUsers": 68 },
      { "month": "Nov", "totalUsers": 55 },
      { "month": "Dec", "totalUsers": 0 }
    ]
  },
  "error": null
}
```

**Status Codes:**

- `200` - Success
- `400` - Bad Request (invalid year)
- `401` - Unauthorized
- `403` - Forbidden (not admin/superadmin)
- `500` - Internal Server Error

---

## 3. Get Recent Orders

**Endpoint:** `GET /api/dashboard/recent-orders`

**Description:** Retrieves a list of recent orders placed by customers.

**Headers:**

```
Authorization: Bearer <your_admin_token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Number of orders to return |

**Example Request:**

```
GET /api/dashboard/recent-orders?limit=7
```

**Response:**

```json
{
  "success": true,
  "message": "Recent orders retrieved successfully",
  "data": [
    {
      "orderNumber": "#LUN-001",
      "customerName": "John Doe",
      "status": "Delivered",
      "date": "2023-06-15",
      "totalAmount": 129.99,
      "items": [...]
    },
    {
      "orderNumber": "#LUN-002",
      "customerName": "Jane Smith",
      "status": "Shipped",
      "date": "2023-06-14",
      "totalAmount": 89.99,
      "items": [...]
    }
  ],
  "error": null
}
```

**Order Status Values:**

- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin/superadmin)
- `500` - Internal Server Error

---

## 4. Get Recent Users

**Endpoint:** `GET /api/dashboard/recent-users`

**Description:** Retrieves a list of recently registered users.

**Headers:**

```
Authorization: Bearer <your_admin_token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Number of users to return |

**Example Request:**

```
GET /api/dashboard/recent-users?limit=7
```

**Response:**

```json
{
  "success": true,
  "message": "Recent users retrieved successfully",
  "data": [
    {
      "name": "Alice Walker",
      "email": "alice@example.com",
      "registrationDate": "2023-06-15"
    },
    {
      "name": "David Chen",
      "email": "david@example.com",
      "registrationDate": "2023-06-14"
    },
    {
      "name": "Sarah Jones",
      "email": "sarah@example.com",
      "registrationDate": "2023-06-14"
    }
  ],
  "error": null
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin/superadmin)
- `500` - Internal Server Error

---

## Environment Variables

Set these in your Postman environment:

| Variable    | Value                 | Description                |
| ----------- | --------------------- | -------------------------- |
| BASE_URL    | http://localhost:3000 | Your API base URL          |
| ADMIN_TOKEN | <your_token>          | Admin authentication token |

---

## Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": "Detailed error message"
}
```

---

## Testing Steps

1. **Set up Environment:**
   - Create a new environment in Postman
   - Add `BASE_URL` and `ADMIN_TOKEN` variables

2. **Authentication:**
   - First, login to get your admin token
   - Set the token in the `ADMIN_TOKEN` environment variable

3. **Test Endpoints:**
   - Start with `/get-stats` to verify basic functionality
   - Test `/user-growth` with different years
   - Test `/recent-orders` and `/recent-users` with different limits

4. **Verify Responses:**
   - Check for `success: true` in responses
   - Verify data structure matches the examples above
   - Test error scenarios (invalid year, missing token, etc.)

---

## Postman Collection JSON

You can import this collection directly into Postman:

```json
{
  "info": {
    "name": "Dashboard API",
    "description": "E-commerce Dashboard API endpoints for admin and superadmin users"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:3000"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{ADMIN_TOKEN}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Get Dashboard Stats",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{BASE_URL}}/api/dashboard/get-stats",
          "host": ["{{BASE_URL}}"],
          "path": ["api", "dashboard", "get-stats"]
        }
      }
    },
    {
      "name": "Get User Growth",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{BASE_URL}}/api/dashboard/user-growth?year=2026",
          "host": ["{{BASE_URL}}"],
          "path": ["api", "dashboard", "user-growth"],
          "query": [
            {
              "key": "year",
              "value": "2026",
              "description": "Year for user growth data"
            }
          ]
        }
      }
    },
    {
      "name": "Get Recent Orders",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{BASE_URL}}/api/dashboard/recent-orders?limit=7",
          "host": ["{{BASE_URL}}"],
          "path": ["api", "dashboard", "recent-orders"],
          "query": [
            {
              "key": "limit",
              "value": "7",
              "description": "Number of orders to return"
            }
          ]
        }
      }
    },
    {
      "name": "Get Recent Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{BASE_URL}}/api/dashboard/recent-users?limit=7",
          "host": ["{{BASE_URL}}"],
          "path": ["api", "dashboard", "recent-users"],
          "query": [
            {
              "key": "limit",
              "value": "7",
              "description": "Number of users to return"
            }
          ]
        }
      }
    }
  ]
}
```

---

---

**Note:** Make sure your server is running and you have a valid admin/superadmin token before testing these endpoints.
