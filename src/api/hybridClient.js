import api from './client';
import { getMockResponse, shouldUseMock } from '../utils/mockDataService';
import config from '../config';
import jwtService from '../utils/jwtService';

// Hybrid client that automatically switches between real APIs and mock data
class HybridClient {
  constructor() {
    this.realClient = api;
    this.config = config;
  }

  // Generic request method that handles both real and mock
  async request(method, url, data = null, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.asnBaseUrl}${url}`;
    
    // Check if we should use mock data
    if (shouldUseMock(fullUrl, this.config)) {
      console.log(`🔄 [HYBRID MODE] Using mock data for: ${url}`);
      return this.handleMockRequest(method, url, data, options);
    }
    
    // Use real API
    console.log(`🌐 [HYBRID MODE] Using real API for: ${url}`);
    return this.handleRealRequest(method, url, data, options);
  }

  // Handle mock requests
  async handleMockRequest(method, url, data, options) {
    try {
      const response = await getMockResponse(url, { method, data, ...options });
      
      // Simulate axios response structure
      return {
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url, method, data }
      };
    } catch (error) {
      console.error(`❌ [MOCK] Error in mock request:`, error);
      throw error;
    }
  }

  // Handle real API requests
  async handleRealRequest(method, url, data, options) {
    try {
      const config = {
        method,
        url,
        data,
        ...options
      };
      
      return await this.realClient.request(config);
    } catch (error) {
      console.error(`❌ [REAL API] Error in real request:`, error);
      
      // Fallback to mock if real API fails
      if (this.config.hybridMode?.enabled && this.config.hybridMode?.fallbackToMock) {
        console.log(`🔄 [HYBRID MODE] Real API failed, falling back to mock for: ${url}`);
        return this.handleMockRequest(method, url, data, options);
      }
      
      throw error;
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.request('GET', url, null, options);
  }

  async post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  async put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  async delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  // Direct fetch wrapper for existing code
  async fetch(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.asnBaseUrl}${url}`;
    
    // Add JWT authorization header for approval APIs
    if (url.includes('/api/Approval/') && jwtService.hasToken()) {
      const authHeader = jwtService.getAuthHeader();
      if (authHeader) {
        options.headers = {
          ...options.headers,
          'Authorization': authHeader
        };
        console.log(`🔐 [JWT] Added authorization header for: ${url}`);
      }
    }
    
    if (shouldUseMock(fullUrl, this.config)) {
      console.log(`🔄 [HYBRID MODE] Using mock data for fetch: ${url}`);
      const response = await getMockResponse(url, options);
      return {
        ok: true,
        status: 200,
        json: async () => response,
        text: async () => JSON.stringify(response)
      };
    }
    
    // Use real fetch with fallback to mock
    console.log(`🌐 [HYBRID MODE] Using real fetch for: ${url}`);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const fetchOptions = {
        ...options,
        signal: controller.signal
      };
      
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      console.error(`❌ [REAL FETCH] Error:`, error);
      
      // Fallback to mock if real API fails and fallback is enabled
      if (this.config.hybridMode?.enabled && this.config.hybridMode?.fallbackToMock) {
        console.log(`🔄 [HYBRID MODE] Real fetch failed, falling back to mock for: ${url}`);
        const response = await getMockResponse(url, options);
        return {
          ok: true,
          status: 200,
          json: async () => response,
          text: async () => JSON.stringify(response)
        };
      }
      
      throw error;
    }
  }
}

// Create singleton instance
const hybridClient = new HybridClient();

export default hybridClient;
