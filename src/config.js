const config = {
  // baseUrl: 'http://103.55.63.14:8016',
  // asnBaseUrl: 'http://192.168.151.24:4731',

  // baseUrl : 'https://localhost:44355',
  // asnBaseUrl: "https://localhost:44327",

  // asnBaseUrl: "https://v2srm.v2retail.com:9001", // prod.
  asnBaseUrl: "http://192.168.149.75", // dev. - working dropdown APIs
  imageBaseUrl: "http://192.168.149.75", // dev. - for image files
  baseUrl: "https://routemaster.v2retail.com:9010",
  // baseUrl: "https://routemaster.v2retail.com:9011",
  // baseUrl: "http://192.168.151.36:9005",
  downloadUrl: "https://v2srm.v2retail.com:8745",
  
  // Hybrid Mode Configuration
  hybridMode: {
    enabled: true, // Set to false to disable hybrid mode
    fallbackToMock: true, // Automatically fallback to mock if real API fails
    forceAllMock: true, // Force all APIs to use mock data in hybrid mode
    mockEndpoints: [
      // Auth APIs
      '/api/Auth/Login',
      
      // Article APIs
      '/api/Article/InsertArticleData',
      '/api/Article/UpdateArticleById',
      '/api/Article/DeleteArticleDetails',
      '/api/Article/SendArticlesForApproval',
      '/api/Article/GetAllArticleMasterDetail',
      '/api/Article/GetArticleMasterDetailById',
      '/api/Article/UploadArticleExcel',
      
      // Dropdown APIs
      '/api/Dropdown/GetDynamicDropdownData',
      '/api/Dropdown/GetAllFGSegmentDetail',
      '/api/Dropdown/GetAllDivisionsBySegment',
      '/api/Dropdown/GetAllSubDivisions',
      '/api/Dropdown/GetAllMajorCategories',
      '/api/Dropdown/GetMC_CodeDetails',
      '/api/Dropdown/GetAllMcDescriptions',
      '/api/Dropdown/GetMCSTDetails',
      
      // Approval APIs
      '/api/Approval/SendArticlesForApproval',
      '/api/Approval/ApproveByLevel',
      '/api/Approval/GetApprovalStatus',
      
      // Any other APIs
      '/api/*'
    ],
    workingEndpoints: [] // No real APIs in hybrid mode - all use mock
  }
};

export default config;
