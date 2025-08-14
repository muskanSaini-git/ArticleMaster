# Article Creation System - API Documentation

## Base URLs
- **Main API**: `https://routemaster.v2retail.com:9010`
- **ASN API**: `http://192.168.150.101`
- **Image Base URL**: `http://192.168.150.101`
- **Download URL**: `https://v2srm.v2retail.com:8745`

---

## 1. Authentication APIs

### 1.1 Login API
```
POST /api/auth/login
```
**Description**: User authentication with role-based access
**Request Body**:
```json
{
  "username": "string",
  "password": "string",
  "role": "article_creation|approval|admin"
}
```
**Response**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "role": "string",
    "permissions": ["array_of_permissions"]
  }
}
```

### 1.2 Logout API
```
POST /api/auth/logout
```
**Description**: User logout and token invalidation
**Headers**: `Authorization: Bearer {token}`

---

## 2. Article Management APIs

### 2.1 Get All Articles
```
GET /api/articles
```
**Description**: Fetch all articles with pagination and filtering
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (pending/approved/rejected)
- `search`: Search term
- `userRole`: Filter by user role (for admin)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "ArticleId": "string",
      "MC_CODE": "string",
      "SEG": "string",
      "DIV": "string",
      "MAJ_CAT_NM": "string",
      "ARTICLE_DESCRIPTION": "string",
      "STATUS": "string",
      "ART_CR_DATE": "date",
      "VND_NM": "string",
      "MRP": "number",
      "Images": ["array_of_image_urls"],
      "createdBy": "user_id",
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```

### 2.2 Get Article by ID
```
GET /api/articles/{articleId}
```
**Description**: Fetch specific article details
**Response**: Single article object with full details

### 2.3 Create New Article
```
POST /api/articles
```
**Description**: Create new article
**Request Body**:
```json
{
  "MC_CODE": "string",
  "SEG": "string",
  "DIV": "string",
  "MAJ_CAT_NM": "string",
  "ARTICLE_DESCRIPTION": "string",
  "VND_NM": "string",
  "MRP": "number",
  "Images": ["base64_or_urls"],
  "additionalFields": {}
}
```

### 2.4 Update Article
```
PUT /api/articles/{articleId}
```
**Description**: Update existing article
**Request Body**: Same as create, but partial updates allowed

### 2.5 Delete Article
```
DELETE /api/articles/{articleId}
```
**Description**: Delete article (soft delete)

---

## 3. Approval Workflow APIs

### 3.1 Submit for Approval
```
POST /api/articles/{articleId}/approve
```
**Description**: Submit article for approval
**Request Body**:
```json
{
  "status": "pending",
  "comments": "string"
}
```

### 3.2 Approve Article
```
PUT /api/articles/{articleId}/approve
```
**Description**: Approve article (for approval role)
**Request Body**:
```json
{
  "status": "approved",
  "comments": "string",
  "approvedBy": "user_id"
}
```

### 3.3 Reject Article
```
PUT /api/articles/{articleId}/reject
```
**Description**: Reject article (for approval role)
**Request Body**:
```json
{
  "status": "rejected",
  "comments": "string",
  "rejectedBy": "user_id",
  "rejectionReason": "string"
}
```

### 3.4 Batch Approval
```
POST /api/articles/batch-approve
```
**Description**: Approve multiple articles at once
**Request Body**:
```json
{
  "articleIds": ["array_of_ids"],
  "status": "approved",
  "comments": "string"
}
```

---

## 4. Dropdown Data APIs

### 4.1 Get Segments
```
GET /api/dropdowns/segments
```
**Description**: Get all segments for dropdown

### 4.2 Get Divisions by Segment
```
GET /api/dropdowns/divisions/{segmentId}
```
**Description**: Get divisions for specific segment

### 4.3 Get Sub-Divisions
```
GET /api/dropdowns/sub-divisions/{divisionId}
```
**Description**: Get sub-divisions for specific division

### 4.4 Get Major Categories
```
GET /api/dropdowns/major-categories/{subDivId}
```
**Description**: Get major categories for specific sub-division

### 4.5 Get MC Descriptions
```
GET /api/dropdowns/mc-descriptions/{majorCatId}
```
**Description**: Get MC descriptions for specific major category

### 4.6 Get MCST Details
```
GET /api/dropdowns/mcst-details/{mcId}
```
**Description**: Get MCST details for specific MC

---

## 5. File Upload APIs

### 5.1 Upload Images
```
POST /api/upload/images
```
**Description**: Upload article images
**Request**: Multipart form data
**Response**:
```json
{
  "success": true,
  "urls": ["array_of_image_urls"],
  "uploadedCount": "number"
}
```

### 5.2 Upload Excel File
```
POST /api/upload/excel
```
**Description**: Upload Excel file for bulk article creation
**Request**: Multipart form data (Excel file)
**Response**:
```json
{
  "success": true,
  "processedRows": "number",
  "errors": ["array_of_errors"],
  "articles": ["array_of_created_articles"]
}
```

---

## 6. Export APIs

### 6.1 Export to Excel
```
GET /api/export/articles
```
**Description**: Export articles to Excel file
**Query Parameters**:
- `status`: Filter by status
- `dateFrom`: Start date
- `dateTo`: End date
- `format`: xlsx|csv

### 6.2 Export by Status
```
GET /api/export/articles/{status}
```
**Description**: Export articles by specific status

---

## 7. Search and Filter APIs

### 7.1 Search Articles
```
GET /api/search/articles
```
**Description**: Search articles with advanced filters
**Query Parameters**:
- `q`: Search query
- `status`: Status filter
- `dateFrom`: Date range start
- `dateTo`: Date range end
- `vendor`: Vendor filter
- `category`: Category filter

### 7.2 Get Recent Articles
```
GET /api/articles/recent
```
**Description**: Get recently added articles (last 7 days)

### 7.3 Get Updated Articles
```
GET /api/articles/updated
```
**Description**: Get recently updated articles

---

## 8. User Management APIs

### 8.1 Get User Profile
```
GET /api/user/profile
```
**Description**: Get current user profile

### 8.2 Update User Profile
```
PUT /api/user/profile
```
**Description**: Update user profile

### 8.3 Get Users (Admin Only)
```
GET /api/admin/users
```
**Description**: Get all users (admin only)

---

## 9. Statistics APIs

### 9.1 Get Dashboard Stats
```
GET /api/stats/dashboard
```
**Description**: Get dashboard statistics
**Response**:
```json
{
  "totalArticles": "number",
  "pendingArticles": "number",
  "approvedArticles": "number",
  "rejectedArticles": "number",
  "recentArticles": "number",
  "updatedArticles": "number"
}
```

### 9.2 Get Status Counts
```
GET /api/stats/status-counts
```
**Description**: Get article counts by status

---

## 10. Notification APIs

### 10.1 Get Notifications
```
GET /api/notifications
```
**Description**: Get user notifications

### 10.2 Mark Notification Read
```
PUT /api/notifications/{notificationId}/read
```
**Description**: Mark notification as read

---

## Error Responses

All APIs return consistent error format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

## Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid username/password
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Request validation failed
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

---

## Authentication Headers
All protected APIs require:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## File Upload Limits
- Maximum file size: 10MB per file
- Supported formats: JPG, PNG, PDF, XLSX
- Maximum 10 files per request
