import { sampleData } from '../data/sampleData';

// Mock responses for incomplete APIs
const mockResponses = {
  // Auth responses
  '/api/Auth/Login': {
    status: true,
    message: 'Login successful (Mock)',
    data: {
      email: 'demo@example.com',
      roleId: 1,
      roleName: 'Admin',
      userId: Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJSb2xlSWQiOiIxIiwibmJmIjoxNzU1MTQyMjk2LCJleHAiOjE3NTUyMjg2OTYsImlhdCI6MTc1NTE0MjI5NiwiaXNzIjoiSnN0QXV0aERlbW8iLCJhdWQiOiJKc3RBdXRoRGVtb1VzZXIifQ.b1txHUb5xALa3gLRCDeIeYnVHRlPEhxpKEIfadaGpvw',
      refreshToken: 'zIDY1WOViO7OQfhKcpoiLJvEz5ZFSwqfQ48I760fiHs='
    }
  },
  
  // Article Insert/Update responses
  '/api/Article/InsertArticleData': {
    success: true,
    message: 'Article data inserted successfully (Mock)',
    data: {
      id: Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      insertedCount: 1
    }
  },
  
  '/api/Article/UpdateArticleById': {
    success: true,
    message: 'Article updated successfully (Mock)',
    data: {
      id: Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      updatedCount: 1
    }
  },
  
  '/api/Article/DeleteArticleDetails': {
    success: true,
    message: 'Articles deleted successfully (Mock)',
    data: {
      deletedCount: 1,
      timestamp: new Date().toISOString()
    }
  },
  
  '/api/Article/SendArticlesForApproval': {
    success: true,
    message: 'Articles sent for approval successfully (Mock)',
    data: {
      sentCount: 1,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    }
  },
  
  // Article Get responses
  '/api/Article/GetAllArticleMasterDetail': {
    success: true,
    message: 'Articles fetched successfully (Mock)',
    data: {
      articles: sampleData,
      totalCount: sampleData.length,
      pageNumber: 1,
      pageSize: 10,
      timestamp: new Date().toISOString()
    }
  },
  
  '/api/Article/GetArticleMasterDetailById': {
    success: true,
    message: 'Article fetched successfully (Mock)',
    data: {
      article: sampleData[0],
      timestamp: new Date().toISOString()
    }
  },
  
  '/api/Article/UploadArticleExcel': {
    success: true,
    message: 'Excel uploaded successfully (Mock)',
    data: {
      uploadedCount: 5,
      timestamp: new Date().toISOString()
    }
  },
  
  // Approval APIs
  '/api/Approval/SendArticlesForApproval': {
    success: true,
    message: 'Articles sent for approval successfully (Mock)',
    data: {
      sentCount: 1,
      status: 'Sent for Approval',
      timestamp: new Date().toISOString(),
      approvalId: Math.floor(Math.random() * 10000)
    }
  },
  
  '/api/Approval/ApproveByLevel': {
    success: true,
    message: 'Articles approved successfully (Mock)',
    data: {
      approvedCount: 1,
      status: 'Approved',
      approvedBy: 'Mock User',
      timestamp: new Date().toISOString(),
      remarks: 'Approved by Mock User'
    }
  },
  
  '/api/Approval/GetApprovalStatus': {
    success: true,
    message: 'Approval status fetched successfully (Mock)',
    data: {
      status: 'Pending',
      level: 1,
      timestamp: new Date().toISOString()
    }
  }
};

// Generate realistic mock data for dropdowns if needed
const generateMockDropdownData = (endpoint, params = {}) => {
  const mockData = {
    '/api/Dropdown/GetDynamicDropdownData': [
      { id: 1, name: 'Macro1', value: 'Macro1' },
      { id: 2, name: 'Macro2', value: 'Macro2' },
      { id: 3, name: 'Macro3', value: 'Macro3' }
    ],
    '/api/Dropdown/GetAllFGSegmentDetail': [
      { id: 1, name: 'APP', value: 'APP' },
      { id: 2, name: 'FOOTWEAR', value: 'FOOTWEAR' },
      { id: 3, name: 'ACCESSORIES', value: 'ACCESSORIES' }
    ],
    '/api/Dropdown/GetAllDivisionsBySegment': [
      { id: 1, name: 'KIDS', value: 'KIDS' },
      { id: 2, name: 'MEN', value: 'MEN' },
      { id: 3, name: 'WOMEN', value: 'WOMEN' }
    ],
    '/api/Dropdown/GetAllSubDivisions': [
      { id: 1, name: 'KB-SETS', value: 'KB-SETS' },
      { id: 2, name: 'MB-SETS', value: 'MB-SETS' },
      { id: 3, name: 'WB-SETS', value: 'WB-SETS' }
    ],
    '/api/Dropdown/GetAllMajorCategories': [
      { id: 1, name: 'IB_B_SUIT_FS', value: 'IB_B_SUIT_FS' },
      { id: 2, name: 'IB_B_SUIT_SS', value: 'IB_B_SUIT_SS' },
      { id: 3, name: 'IB_B_SUIT_WS', value: 'IB_B_SUIT_WS' }
    ],
    '/api/Dropdown/GetMC_CodeDetails': [
      { id: 1, name: '113030110', value: '113030110' },
      { id: 2, name: '113030120', value: '113030120' },
      { id: 3, name: '113030130', value: '113030130' }
    ],
    '/api/Dropdown/GetAllMcDescriptions': [
      { id: 1, name: 'M_TEES_HS', value: 'M_TEES_HS' },
      { id: 2, name: 'M_TEES_MS', value: 'M_TEES_MS' },
      { id: 3, name: 'M_TEES_LS', value: 'M_TEES_LS' }
    ],
    '/api/Dropdown/GetMCSTDetails': [
      { id: 1, name: 'MCST1', value: 'MCST1' },
      { id: 2, name: 'MCST2', value: 'MCST2' },
      { id: 3, name: 'MCST3', value: 'MCST3' }
    ]
  };
  
  return mockData[endpoint] || [];
};

// Main mock service function
export const getMockResponse = (endpoint, params = {}) => {
  // Simulate API delay
  const delay = Math.random() * 1000 + 200; // 200ms to 1200ms
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockResponses[endpoint]) {
        resolve(mockResponses[endpoint]);
      } else if (endpoint.includes('/api/Dropdown/')) {
        resolve({
          success: true,
          data: generateMockDropdownData(endpoint, params)
        });
      } else if (endpoint.includes('/api/')) {
        // Generic mock response for any API endpoint
        const method = params.method || 'GET';
        const genericResponse = {
          success: true,
          message: `${method} request successful (Mock)`,
          data: {
            id: Math.floor(Math.random() * 10000),
            timestamp: new Date().toISOString(),
            endpoint: endpoint,
            method: method,
            mock: true
          }
        };
        
        console.log(`🔄 [GENERIC MOCK] Generated response for: ${endpoint}`);
        resolve(genericResponse);
      } else {
        resolve({
          success: false,
          message: 'Mock endpoint not found',
          data: null
        });
      }
    }, delay);
  });
};

// Check if endpoint should use mock data
export const shouldUseMock = (endpoint, config) => {
  if (!config.hybridMode?.enabled) return false;
  
  // If forceAllMock is enabled, all APIs use mock data
  if (config.hybridMode?.forceAllMock) {
    console.log(`🔄 [FORCE MOCK] All APIs using mock data: ${endpoint}`);
    return true;
  }
  
  // Handle both full URLs and relative paths
  let normalizedEndpoint = endpoint;
  
  // If it's a full URL, extract just the API path
  if (endpoint.startsWith('http')) {
    try {
      const url = new URL(endpoint);
      normalizedEndpoint = url.pathname;
    } catch (error) {
      // If URL parsing fails, try to extract the API path manually
      const apiIndex = endpoint.indexOf('/api/');
      if (apiIndex !== -1) {
        normalizedEndpoint = endpoint.substring(apiIndex);
      }
    }
  }
  
  // Check for wildcard pattern
  if (config.hybridMode.mockEndpoints.includes('/api/*')) {
    if (normalizedEndpoint.startsWith('/api/')) {
      console.log(`🔍 [WILDCARD MOCK] Endpoint matched wildcard: ${endpoint}`);
      return true;
    }
  }
  
  console.log(`🔍 [MOCK CHECK] Endpoint: ${endpoint} → Normalized: ${normalizedEndpoint}`);
  return config.hybridMode.mockEndpoints.includes(normalizedEndpoint);
};

// Get sample data for form population
export const getSampleData = () => sampleData;

export default {
  getMockResponse,
  shouldUseMock,
  getSampleData
};
