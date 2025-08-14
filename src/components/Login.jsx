import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import './Login.css';
import jwtService from '../utils/jwtService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '200300',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // FRONTEND-ONLY LOGIN FOR DEMO - No backend API calls
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user validation
      let userData = null;
      let internalRole = 'user';
      
      // Simple demo validation
      if (formData.username === 'admin' && formData.password === 'admin123') {
        internalRole = 'admin';
        userData = {
          id: 1,
          username: 'admin',
          email: 'admin@demo.com',
          roleName: 'Admin',
          accessToken: 'demo-admin-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      } else if (formData.username === 'article' && formData.password === 'article123') {
        internalRole = 'article_creation';
        userData = {
          id: 2,
          username: 'article',
          email: 'article@demo.com',
          roleName: 'Article Creator',
          accessToken: 'demo-article-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      } else if (formData.username === 'approval' && formData.password === 'approval123') {
        internalRole = 'approval';
        userData = {
          id: 3,
          username: 'approval',
          email: 'approval@demo.com',
          roleName: 'Approver',
          accessToken: 'demo-approval-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      } else if (formData.username === 'purchase' && formData.password === 'purchase123') {
        internalRole = 'purchase';
        userData = {
          id: 4,
          username: 'purchase',
          email: 'purchase@demo.com',
          roleName: 'Purchase Officer',
          accessToken: 'demo-purchase-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      } else if (formData.username === 'merchant' && formData.password === 'merchant123') {
        internalRole = 'merchant';
        userData = {
          id: 5,
          username: 'merchant',
          email: 'merchant@demo.com',
          roleName: 'Merchant',
          accessToken: 'demo-merchant-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      } else {
        // Default demo user
        internalRole = 'user';
        userData = {
          id: 6,
          username: formData.username,
          email: formData.username + '@demo.com',
          roleName: 'User',
          accessToken: 'demo-user-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        };
      }

      try {
        // Store user data and tokens using correct JWT service functions
        jwtService.storeUserData(userData);
        jwtService.storeTokens(userData.accessToken, userData.refreshToken);
        
        // Call onLogin with user data and role
        onLogin(userData, internalRole);
        
      } catch (storageError) {
        console.error('❌ Error storing user data:', storageError);
        setError('Failed to store user session. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section - Login Form */}
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h1 className="app-title">Article Master</h1>
              <p className="app-subtitle">Fashion Design & Management</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label">
                  <FaUser className="field-icon" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <FaLock className="field-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>



              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <div className="spinner"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="image-section">
          <div className="image-container">
            <img 
              src="/assists/loginimage2.png" 
              alt="Fashion Designer at Work"
              className="hero-image"
              onLoad={() => {
                // Image loaded successfully
              }}
              onError={(e) => {
                // Handle image load error silently
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;