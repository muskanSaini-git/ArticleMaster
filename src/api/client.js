import config from '../config';

// API Client for backend integration
class ApiClient {
  constructor() {
    this.baseUrl = config.baseUrl;
    this.asnBaseUrl = config.asnBaseUrl;
    this.imageBaseUrl = config.imageBaseUrl;
    this.downloadUrl = config.downloadUrl;
    this.timeout = config.apiConfig.timeout;
    this.retryAttempts = config.apiConfig.retryAttempts;
    this.retryDelay = config.apiConfig.retryDelay;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json'
    };
  }

  // Make HTTP request with retry logic
  async makeRequest(url, options = {}, retryCount = 0) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        },
        timeout: this.timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.retryAttempts) {
        console.log(`API request failed, retrying... (${retryCount + 1}/${this.retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.makeRequest(url, options, retryCount + 1);
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(this.baseUrl + endpoint);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    return this.makeRequest(url.toString(), {
      method: 'GET'
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.makeRequest(this.baseUrl + endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.makeRequest(this.baseUrl + endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.makeRequest(this.baseUrl + endpoint, {
      method: 'DELETE'
    });
  }

  // Upload file
  async uploadFile(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest(this.baseUrl + endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': this.getAuthHeaders().Authorization
      }
    });
  }

  // Download file
  async downloadFile(endpoint, filename) {
    try {
      const response = await fetch(this.downloadUrl + endpoint, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  // ASN API requests
  async asnGet(endpoint, params = {}) {
    const url = new URL(this.asnBaseUrl + endpoint);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    return this.makeRequest(url.toString(), {
      method: 'GET'
    });
  }

  async asnPost(endpoint, data = {}) {
    return this.makeRequest(this.asnBaseUrl + endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Image URL helper
  getImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return this.imageBaseUrl + imagePath;
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;
