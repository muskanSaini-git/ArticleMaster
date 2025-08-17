import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch, FaBell, FaUser, FaCog, FaHome, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import './TopBar.css';

const TopBar = ({ onSidebarToggle, currentPage, onPageChange }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
    setShowProfileDropdown(false);
    // You can add your logout logic here
    // For example: localStorage.removeItem('token'), redirect to login, etc.
  };

  const handleViewProfile = () => {
    onPageChange('profile');
    setShowProfileDropdown(false);
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <button className="sidebar-toggle-btn" onClick={onSidebarToggle}>
              <FaBars className="sidebar-icon" />
            </button>
            
            <div className="title-section">
              <FaHome className="title-icon" />
              <h1>Article Master</h1>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="search-section">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search parcels..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="top-icons">
              <button className="notification-btn">
                <FaBell />
                <span className="notification-badge">3</span>
              </button>
            </div>

            <div className="profile-section" ref={profileRef}>
              <button className="profile-btn" onClick={handleProfileClick}>
                <FaUser className="profile-icon" />
                <span className="profile-text">Manager</span>
                <FaChevronDown className={`profile-dropdown-icon ${showProfileDropdown ? 'rotated' : ''}`} />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="profile-info">
                      <div className="profile-name">Manager</div>
                      <div className="profile-email">manager@company.com</div>
                    </div>
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <div className="profile-dropdown-options">
                    <button className="profile-dropdown-option" onClick={handleViewProfile}>
                      <FaUserCircle className="option-icon" />
                      <span>View Profile</span>
                    </button>
                    
                    <button className="profile-dropdown-option logout" onClick={handleLogout}>
                      <FaSignOutAlt className="option-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TopBar; 