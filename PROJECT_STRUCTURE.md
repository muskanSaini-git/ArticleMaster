# Article Master - Project Structure & Flow

## 🎯 **Project Overview**
Article Master is a fashion design & management system with a simple, clear role-based workflow and backend API integration.

## 🔐 **Role-Based Access Control**

### **1. Article Creation Role**
- **Purpose**: Create articles and send for approval (Change Status Column From Action if article send show text sent if approved by PO show Approved PO, If approved by Merchant show approve Merchant if approved by admin show apprved admin) same case in rejects
- **Access**: 
  - Create Article with my article in the tables (open by default)
  - Approved Article
  - Pending Approval
  - Reject Article
  - Profile

### **2. Approval Role (PO + Merchant)**
- **Purpose**: Receive and approve/reject articles
- **Access**:
  - All Articles (open by default)
  - Pending Approvals
  - Approved Articles
  - Rejected Articles
  - Profile

### **3. Admin Role**
- **Purpose**: Create articles + approve/reject + master management
- **Access**:
  - All Articles (open by default)
  - Pending Approvals
  - Approved Articles
  - Rejected Articles
  - Create Article
  - Master Management
  - Profile

## 📁 **File Structure**

```
src/
├── components/                 # Main UI components
│   ├── Login.jsx             # Login with role selection
│   ├── Layout.jsx            # Main layout with sidebar
│   ├── TopBar.jsx            # Top navigation bar
│   ├── ParcelsList.jsx       # Articles list
│   ├── PendingParcels.jsx    # Pending articles
│   ├── Approvals.jsx         # Approved articles
│   ├── Rejections.jsx        # Rejected articles
│   ├── Profile.jsx           # User profile
│   └── MasterDropdown.jsx    # Master data management
├── Creations/                 # Article creation components
│   ├── ArticalParcel.jsx     # Main article creation form
│   ├── ArticleParcelViewModal.jsx  # Article view modal
│   └── ArticleParcelApproval.jsx   # Article approval
├── api/                       # API services
│   ├── client.js             # Main API client
│   ├── articleApi.js         # Article API functions
│   └── approvalService.js    # Approval service
├── utils/                     # Utility functions
│   ├── jwtService.js         # JWT authentication
│   └── statusManager.js      # Status management
├── config.js                  # API configuration
└── App.js                     # Main routing and app logic
```

## 🔄 **Workflow Flow**

```
1. User Login → Select Role Type
   ↓
2. Role-Based Navigation (No Dashboard)
   ↓
3. Article Creation Role:
   - Create Article → Send for Approval
   - Status: Sent → Approved PO → Approved Merchant → Approved Admin
   - Status: Rejected PO → Rejected Merchant → Rejected Admin
   ↓
4. Approval Role (PO + Merchant):
   - Receive Articles → Approve/Reject
   ↓
5. Admin Role:
   - Create Articles + Approve/Reject + Master Management
```

## 🎨 **UI/UX Principles**
- **No UI changes** - Only logic changes
- **Simple navigation** - Clear role-based menus
- **Consistent design** - Same look across all pages
- **Mobile responsive** - Works on all screen sizes

## 🚀 **Getting Started**

1. **Login**: Select your role type
2. **Navigate**: Use sidebar based on your role
3. **Workflow**: Follow the role-specific process
4. **Master Data**: Admin can manage all master data

## 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes
- No horizontal scrolling issues

## 🔧 **Technical Features**
- React Router for navigation
- Role-based access control
- Protected routes
- JWT authentication
- Responsive CSS with media queries
- Component-based architecture
- Backend API integration through config.js

## 📋 **Key Benefits**
- **Simple**: Easy to understand workflow
- **Clear**: Role-based access control
- **Maintainable**: Clean code structure
- **Scalable**: Easy to add new features
- **User-friendly**: Intuitive navigation
- **Backend Ready**: Direct API integration
