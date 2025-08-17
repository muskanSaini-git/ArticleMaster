const config = {
  // API Base URLs
  baseUrl: "https://routemaster.v2retail.com:9010", // Main API base URL
  asnBaseUrl: "http://192.168.149.75", // ASN API base URL
  imageBaseUrl: "http://192.168.149.75", // Image files base URL
  downloadUrl: "https://v2srm.v2retail.com:8745", // Download base URL
  
  // API Endpoints
  endpoints: {
    // Auth APIs
    auth: {
      login: '/api/Auth/Login',
      logout: '/api/Auth/Logout',
      refreshToken: '/api/Auth/RefreshToken'
    },
    
    // Article APIs
    article: {
      insert: '/api/Article/InsertArticleData',
      update: '/api/Article/UpdateArticleById',
      delete: '/api/Article/DeleteArticleDetails',
      sendForApproval: '/api/Article/SendArticlesForApproval',
      getAll: '/api/Article/GetAllArticleMasterDetail',
      getById: '/api/Article/GetArticleMasterDetailById',
      uploadExcel: '/api/Article/UploadArticleExcel'
    },
    
    // Dropdown APIs
    dropdown: {
      dynamic: '/api/Dropdown/GetDynamicDropdownData',
      segments: '/api/Dropdown/GetAllFGSegmentDetail',
      divisions: '/api/Dropdown/GetAllDivisionsBySegment',
      subDivisions: '/api/Dropdown/GetAllSubDivisions',
      categories: '/api/Dropdown/GetAllMajorCategories',
      mcCodes: '/api/Dropdown/GetMC_CodeDetails',
      descriptions: '/api/Dropdown/GetAllMcDescriptions',
      mcstDetails: '/api/Dropdown/GetMCSTDetails'
    },
    
    // Approval APIs
    approval: {
      sendForApproval: '/api/Approval/SendArticlesForApproval',
      approveByLevel: '/api/Approval/ApproveByLevel',
      getStatus: '/api/Approval/GetApprovalStatus'
    }
  },
  
  // API Configuration
  apiConfig: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  }
};

export default config;
