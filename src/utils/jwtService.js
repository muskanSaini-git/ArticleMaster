// JWT Token Service for Authentication
class JWTService {
  constructor() {
    this.accessTokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
    this.userDataKey = 'userData';
  }

  // Store tokens after login
  storeTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem(this.accessTokenKey, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Check if token exists
  hasToken() {
    return !!this.getAccessToken();
  }

  // Check if token is expired (basic check)
  isTokenExpired() {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  // Get authorization header
  getAuthHeader() {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : '';
  }

  // Clear all tokens
  clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userDataKey);
  }

  // Get user data
  getUserData() {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Store user data
  storeUserData(userData) {
    if (userData) {
      localStorage.setItem(this.userDataKey, JSON.stringify(userData));
    }
  }

  // Check if user has specific role
  hasRole(roleName) {
    const userData = this.getUserData();
    return userData?.roleName === roleName;
  }

  // Check if user can approve
  canApprove() {
    const userData = this.getUserData();
    const approvalRoles = ['Admin', 'Merchant', 'Approver', 'Purchase', 'POCommitte-Level1'];
    return approvalRoles.includes(userData?.roleName);
  }

  // Check if user can send for approval
  canSendForApproval() {
    const userData = this.getUserData();
    const creationRoles = ['Admin', 'Article Creator'];
    return creationRoles.includes(userData?.roleName);
  }
}

// Create singleton instance
const jwtService = new JWTService();

export default jwtService;
