# Hybrid Mode System

## Overview
Hybrid mode allows the application to work with both real APIs and mock data simultaneously. This is perfect for demos where some APIs are working and others are incomplete.

## How It Works

### 🔄 **Hybrid Mode ON (Default)**
- **All APIs** → Mock data responses (perfect for demos)
- **UI and logic unchanged** - seamless switching
- **No real API calls** - everything works with dummy data

### 🌐 **Real APIs Only**
- All APIs make real calls
- No mock data used

## Configuration

### In `src/config.js`:
```javascript
hybridMode: {
  enabled: true, // Set to false to disable
  fallbackToMock: true, // Automatically fallback to mock if real API fails
  forceAllMock: true, // Force all APIs to use mock data in hybrid mode
  mockEndpoints: [
    '/api/*' // All API endpoints use mock data
  ],
  workingEndpoints: [] // No real APIs in hybrid mode
}
```

## Toggle Control

### Visual Toggle:
- **Green button** (top-right): Hybrid Mode ON
- **Red button** (top-right): Real APIs Only
- Click to switch modes instantly

### Console Logs:
- `🔄 [HYBRID MODE] Using mock data for: /api/...`
- `🌐 [HYBRID MODE] Using real API for: /api/...`

## Mock Data

### Realistic Responses:
- Success messages with timestamps
- Random IDs for uniqueness
- Simulated API delays (200-1200ms)

### Sample Data:
- Uses `src/data/sampleData.js` for form population
- Realistic dropdown options
- Maintains data structure consistency

## Benefits

✅ **Demo Ready**: Show working features with mock data  
✅ **No Code Changes**: UI and logic remain identical  
✅ **Easy Toggle**: Switch between modes instantly  
✅ **Realistic**: Mock responses simulate real API behavior  
✅ **Fallback**: Automatically falls back to mock if real API fails or times out  

## Usage

1. **For Demo**: Keep hybrid mode ON
2. **For Production**: Set `hybridMode.enabled = false`
3. **For Testing**: Toggle between modes as needed

## Files Modified

- `src/config.js` - Added hybrid mode configuration
- `src/utils/mockDataService.js` - Mock data service
- `src/api/hybridClient.js` - Hybrid API client
- `src/components/HybridModeToggle.jsx` - Toggle component
- `src/App.js` - Added toggle to main app
- `src/Creations/ArticleParcelViewModal.jsx` - Updated API calls

## Demo Instructions

1. **Start app** - Hybrid mode is ON by default
2. **Login** - Use demo credentials (demo/demo) with user type selection
3. **All features work** - Everything uses mock data (no real API calls)
4. **Save articles** - Mock data responses
5. **Use dropdowns** - Mock data responses
6. **Send for Approval** - Use JWT token authentication
7. **Toggle mode** - Click button to switch between modes
8. **Show owner** - Demonstrate complete functionality with dummy data

## JWT Authentication System

### **Login Flow:**
1. **User Login** → Receives `accessToken` and `refreshToken`
2. **Token Storage** → Automatically stored in localStorage
3. **API Calls** → Include `Authorization: Bearer <token>` header

### **Approval Workflow:**
1. **Send for Approval** → Updates status to "Sent for Approval"
2. **Approval by Level** → Different user roles can approve/reject
3. **Status Updates** → Real-time status changes in ArticleParcel table

### **API Endpoints:**
- **POST** `/api/Approval/SendArticlesForApproval` - Send articles for approval
- **POST** `/api/Approval/ApproveByLevel` - Approve/reject articles
- **GET** `/api/Approval/GetApprovalStatus` - Get approval status

### **Token Management:**
- **Automatic Storage** → Tokens saved after successful login
- **Header Injection** → All approval APIs include auth headers
- **Token Validation** → Basic expiration checking
- **Secure Logout** → Tokens cleared on logout

## Login Demo Credentials

### **Demo Login (Hybrid Mode)**
- **Username**: `demo`
- **Password**: `demo`
- **Select Type**: Choose from dropdown
  - **Admin** → Full access to all features
  - **Article Creation** → Article creation and management
  - **Approval** → Approval and review features

### **Test Credentials (Fallback)**
- **Admin**: `admin` / `admin`
- **Test User**: `test` / `test`
