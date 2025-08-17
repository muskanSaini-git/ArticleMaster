import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtService from '../utils/jwtService';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    wifeName: '',
    husbandName: '',
    maritalStatus: '',
    placeOfBirth: '',
    address: '',
    nation: '',
    email: '',
    phone: ''
  });

  // Load user data from jwtService
  useEffect(() => {
    const loadUserData = () => {
      const userData = jwtService.getUserData();
      if (userData) {
        // Map user data to profile fields
        setProfileData({
          title: userData.title || 'Mr.',
          firstName: userData.firstName || userData.name?.split(' ')[0] || '',
          middleName: userData.middleName || userData.name?.split(' ')[1] || '',
          lastName: userData.lastName || userData.name?.split(' ').slice(2).join(' ') || '',
          fullName: userData.fullName || userData.name || '',
          gender: userData.gender || '',
          dateOfBirth: userData.dateOfBirth || '',
          fatherName: userData.fatherName || '',
          motherName: userData.motherName || '',
          wifeName: userData.wifeName || '',
          husbandName: userData.husbandName || '',
          maritalStatus: userData.maritalStatus || 'Single',
          placeOfBirth: userData.placeOfBirth || '',
          address: userData.address || '',
          nation: userData.nation || '',
          email: userData.email || userData.emailAddress || '',
          phone: userData.phone || userData.phoneNumber || ''
        });
      } else {
        // If no user data exists, initialize with default data
        const defaultData = {
          title: 'Mr.',
          firstName: 'User',
          middleName: '',
          lastName: 'Name',
          fullName: 'User Name',
          gender: 'Not specified',
          dateOfBirth: 'Not specified',
          fatherName: 'Not specified',
          motherName: 'Not specified',
          wifeName: '',
          husbandName: '',
          maritalStatus: 'Single',
          placeOfBirth: 'Not specified',
          address: 'Not specified',
          nation: 'Not specified',
          email: 'user@example.com',
          phone: 'Not specified'
        };
        
        // Store default data in jwtService
        jwtService.storeUserData(defaultData);
        setProfileData(defaultData);
      }
    };

    loadUserData();

    // Listen for storage changes to update profile when data changes
    const handleStorageChange = (e) => {
      if (e.key === 'userData') {
        loadUserData();
      }
    };

    // Listen for custom profile update events
    const handleProfileUpdate = (e) => {
      if (e.detail) {
        // Update profile data immediately when EditProfile saves
        setProfileData({
          title: e.detail.title || 'Mr.',
          firstName: e.detail.firstName || e.detail.name?.split(' ')[0] || '',
          middleName: e.detail.middleName || e.detail.name?.split(' ')[1] || '',
          lastName: e.detail.lastName || e.detail.name?.split(' ').slice(2).join(' ') || '',
          fullName: e.detail.fullName || e.detail.name || '',
          gender: e.detail.gender || '',
          dateOfBirth: e.detail.dateOfBirth || '',
          fatherName: e.detail.fatherName || '',
          motherName: e.detail.motherName || '',
          wifeName: e.detail.wifeName || '',
          husbandName: e.detail.husbandName || '',
          maritalStatus: e.detail.maritalStatus || 'Single',
          placeOfBirth: e.detail.placeOfBirth || '',
          address: e.detail.address || '',
          nation: e.detail.nation || '',
          email: e.detail.email || e.detail.emailAddress || '',
          phone: e.detail.phone || e.detail.phoneNumber || ''
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Also check for changes every few seconds (fallback)
    const interval = setInterval(loadUserData, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      clearInterval(interval);
    };
  }, []);

  // Function to determine which spouse name field to show
  const shouldShowSpouseName = () => {
    return profileData.maritalStatus === 'Married';
  };

  // Function to determine spouse name label based on title and gender
  const getSpouseNameLabel = () => {
    if (profileData.title === 'Mr.') {
      return 'Wife\'s Name';
    } else if (profileData.title === 'Mrs.' || profileData.title === 'Ms.') {
      return 'Husband\'s Name';
    }
    return 'Spouse\'s Name';
  };

  // Function to get the current spouse name value
  const getSpouseNameValue = () => {
    if (profileData.title === 'Mr.') {
      return profileData.wifeName;
    } else if (profileData.title === 'Mrs.' || profileData.title === 'Ms.') {
      return profileData.husbandName;
    }
    return profileData.wifeName || profileData.husbandName;
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h2>Personal Information</h2>
            <div className="header-actions">
              <button className="refresh-btn" onClick={() => window.location.reload()}>
                🔄 Refresh
              </button>
              <button className="edit-btn" onClick={handleEditProfile}>
                Edit Profile
                </button>
              </div>
          </div>
        </div>

        {/* Body */}
        <div className="profile-body">
          {/* Two Column Layout */}
          <div className="info-columns">
            {/* Left Column */}
            <div className="info-column">
              <div className="form-group">
                <label className="required-field">Title </label>
                <div className="form-display">{profileData.title || 'Not specified'}</div>
              </div>

              <div className="form-group">
                <label className="required-field">First Name </label>
                <div className="form-display">{profileData.firstName || 'Not specified'}</div>
                  </div>

              <div className="form-group">
                <label className="optional-field">Middle Name </label>
                <div className="form-display">{profileData.middleName || 'Not specified'}</div>
              </div>

              <div className="form-group">
                <label className="required-field">Last Name </label>
                <div className="form-display">{profileData.lastName || 'Not specified'}</div>
            </div>

              <div className="form-group">
                <label className="required-field">Full Name </label>
                <div className="form-display">{profileData.fullName || 'Not specified'}</div>
                </div>

              <div className="form-group">
                <label className="required-field">Gender </label>
                <div className="form-display">{profileData.gender || 'Not specified'}</div>
                </div>

              <div className="form-group">
                <label className="required-field">Date of Birth </label>
                <div className="form-display">{profileData.dateOfBirth || 'Not specified'}</div>
                </div>

              <div className="form-group">
                <label className="required-field">Marital Status </label>
                <div className="form-display">{profileData.maritalStatus || 'Not specified'}</div>
                </div>

              <div className="form-group">
                <label className="optional-field">Father's Name </label>
                <div className="form-display">{profileData.fatherName || 'Not specified'}</div>
                </div>

              <div className="form-group">
                <label className="optional-field">Mother's Name </label>
                <div className="form-display">{profileData.motherName || 'Not specified'}</div>
              </div>
                </div>

            {/* Right Column */}
            <div className="info-column">
              <div className="form-group">
                <label className="optional-field">Place of Birth </label>
                <div className="form-display">{profileData.placeOfBirth || 'Not specified'}</div>
                </div>

              {shouldShowSpouseName() && (
                <div className="form-group">
                  <label className="optional-field">{getSpouseNameLabel()} </label>
                  <div className="form-display">{getSpouseNameValue() || 'Not specified'}</div>
                </div>
              )}

              <div className="form-group">
                <label className="optional-field">Nation </label>
                <div className="form-display">{profileData.nation || 'Not specified'}</div>
              </div>

              <div className="form-group">
                <label className="optional-field">Phone </label>
                <div className="form-display">{profileData.phone || 'Not specified'}</div>
              </div>

              <div className="form-group">
                <label className="optional-field">Email </label>
                <div className="form-display">{profileData.email || 'Not specified'}</div>
              </div>

              <div className="form-group">
                <label className="optional-field">Address </label>
                <div className="form-display">{profileData.address || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 