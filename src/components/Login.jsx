import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaUserTie } from 'react-icons/fa';
import './Login.css';
import jwtService from '../utils/jwtService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '200300',
    password: '',
    roleType: 'article_creation' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Role types based on project flow
  const roleTypes = [
    { value: 'article_creation', label: 'Article Creation', description: 'Create articles and send for approval' },
    { value: 'approval', label: 'Approval (PO + Merchant)', description: 'Receive and approve/reject articles' },
    { value: 'admin', label: 'Admin', description: 'Create articles + approve/reject + master management' }
  ];

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
      
      // Demo user validation based on selected role
      let userData = null;
      let internalRole = formData.roleType; // Use selected role
      
      // Generate user data based on selected role
      const roleConfig = {
        article_creation: {
          id: 1,
          username: formData.username || 'article_creator',
          email: (formData.username || 'article_creator') + '@demo.com',
          roleName: 'Article Creator',
          accessToken: 'demo-article-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        },
        approval: {
          id: 2,
          username: formData.username || 'approver',
          email: (formData.username || 'approver') + '@demo.com',
          roleName: 'Approver (PO + Merchant)',
          accessToken: 'demo-approval-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        },
        admin: {
          id: 3,
          username: formData.username || 'admin',
          email: (formData.username || 'admin') + '@demo.com',
          roleName: 'Administrator',
          accessToken: 'demo-admin-token-' + Date.now(),
          refreshToken: 'demo-refresh-token-' + Date.now()
        }
      };

      userData = roleConfig[internalRole];

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

              <div className="form-field">
                <label className="form-label">
                  <FaUserTie className="field-icon" />
                  Role Type
                </label>
                <select
                  name="roleType"
                  value={formData.roleType}
                  onChange={handleChange}
                  className="form-input role-select"
                  required
                >
                  {roleTypes.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <small className="role-description">
                  {roleTypes.find(r => r.value === formData.roleType)?.description}
                </small>
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