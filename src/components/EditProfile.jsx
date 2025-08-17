import React, { useState, useEffect } from "react";
import jwtService from '../utils/jwtService';
import "./ProfileEdit.css";

const EditProfile = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
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

  // Load user data from jwtService when component mounts
  useEffect(() => {
    const loadUserData = () => {
      const userData = jwtService.getUserData();
      if (userData) {
        // Map user data to form fields
        setFormData({
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
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to determine which spouse name field to show
  const shouldShowSpouseName = () => {
    return formData.maritalStatus === 'Married';
  };

  // Function to determine spouse name label based on title and gender
  const getSpouseNameLabel = () => {
    if (formData.title === 'Mr.') {
      return 'Wife\'s Name';
    } else if (formData.title === 'Mrs.' || formData.title === 'Ms.') {
      return 'Husband\'s Name';
    }
    return 'Spouse\'s Name';
  };

  // Function to get the current spouse name value
  const getSpouseNameValue = () => {
    if (formData.title === 'Mr.') {
      return formData.wifeName;
    } else if (formData.title === 'Mrs.' || formData.title === 'Ms.') {
      return formData.husbandName;
    }
    return formData.wifeName || formData.husbandName;
  };

  // Function to handle spouse name change
  const handleSpouseNameChange = (e) => {
    const { value } = e.target;
    if (formData.title === 'Mr.') {
      setFormData(prev => ({ ...prev, wifeName: value }));
    } else if (formData.title === 'Mrs.' || formData.title === 'Ms.') {
      setFormData(prev => ({ ...prev, husbandName: value }));
    }
  };

  // Function to save profile data
  const handleSave = () => {
    try {
      // Get current user data
      const currentUserData = jwtService.getUserData() || {};
      
      // Merge form data with existing user data
      const updatedUserData = {
        ...currentUserData,
        ...formData,
        // Ensure we preserve the role and other important fields
        role: currentUserData.role,
        roleName: currentUserData.roleName,
        id: currentUserData.id
      };
      
      // Save updated user data
      jwtService.storeUserData(updatedUserData);
      
      // Trigger a custom event to notify Profile component
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedUserData }));
      
      // Navigate back to profile page
      onPageChange('profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  // Function to handle cancel
  const handleCancel = () => {
    onPageChange('profile');
  };


  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <h2>My Profile › Edit Profile</h2>
          <div className="header-actions">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>

        {/* Body */}
        <div className="profile-body">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <div className="profile-image-placeholder">
                {/* Profile picture placeholder */}
                <button className="image-upload-btn" title="Upload Image">
                  ✏️
                </button>
              </div>
            </div>
            
            {/* Personal Information Section */}
            <div className="personal-info-section">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="info-columns">
                {/* Left Column */}
                <div className="info-column">
                  <div className="form-group">
                    <label>Title </label>
                    <select 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>

                  </div>
                  
                  <div className="form-group">
                    <label>First Name </label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className="form-input"
                    />

                  </div>
                  
                  <div className="form-group">
                    <label>Last Name </label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className="form-input"
                    />

                  </div>

                  <div className="form-group">
                    <label>Gender </label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                  </div>

                  <div className="form-group">
                    <label>Marital Status </label>
                    <select 
                      name="maritalStatus" 
                      value={formData.maritalStatus} 
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                    {formData.maritalStatus === 'Married' && (
                      <small style={{ color: '#28a745', fontSize: '12px' }}>
                        Spouse name field will be shown
                      </small>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Father's Name </label>
                    <input 
                      type="text" 
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      placeholder="Enter father's name"
                      className="form-input"
                    />

                  </div>
                  
                  {shouldShowSpouseName() && (
                    <div className="form-group">
                      <label>{getSpouseNameLabel()} </label>
                      <input 
                        type="text" 
                        name="spouseName"
                        value={getSpouseNameValue()}
                        onChange={handleSpouseNameChange}
                        placeholder={`Enter ${getSpouseNameLabel().toLowerCase()}`}
                        className="form-input"
                      />

                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Nation </label>
                    <select 
                      name="nation" 
                      value={formData.nation} 
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select Nation</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>

                  </div>
                  
                  <div className="form-group">
                    <label>Phone </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="form-input"
                    />

                  </div>
                </div>

                {/* Right Column */}
                <div className="info-column">
                  <div className="form-group">
                    <label className="optional-field">Middle Name </label>
                    <input 
                      type="text" 
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      placeholder="Enter middle name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Full Name </label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="form-input"
                    />

                  </div>

                  <div className="form-group">
                    <label>Date of Birth </label>
                    <input 
                      type="text" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="DD-MM-YYYY"
                      className="form-input"
                    />

                  </div>

                  <div className="form-group">
                    <label>Mother's Name </label>
                    <input 
                      type="text" 
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      placeholder="Enter mother's name"
                      className="form-input"
                    />

                  </div>
                  
                  <div className="form-group">
                    <label>Place of Birth </label>
                    <input 
                      type="text" 
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleInputChange}
                      placeholder="Enter place of birth"
                      className="form-input"
                    />

                  </div>

                  {shouldShowSpouseName() && (
                    <div className="form-group">
                      <label>{getSpouseNameLabel()} </label>
                      <input 
                        type="text" 
                        name="spouseName"
                        value={getSpouseNameValue()}
                        onChange={handleSpouseNameChange}
                        placeholder={`Enter ${getSpouseNameLabel().toLowerCase()}`}
                        className="form-input"
                      />

                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Email </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="form-input"
                    />

                  </div>
                                     <div className="form-group full-width">
                     <label>Address </label>
                     <textarea 
                       name="address"
                       value={formData.address}
                       onChange={handleInputChange}
                       placeholder="Enter complete address"
                       className="form-input"
                       rows="4"
                       style={{ resize: 'vertical', minHeight: '100px' }}
                     />
 
                   </div>
                 </div>
               </div>
             </div>
           </div>

                   {/* Form Action Buttons */}
        <div className="form-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>





          {/* Full Width Fields */}
          <div className="form-section">
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
