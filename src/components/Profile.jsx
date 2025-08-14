import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaUserCircle, FaBuilding, FaIdCard } from 'react-icons/fa';
import './Profile.css';

const Profile = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Manager',
    email: 'manager@company.com',
    phone: '+91 98765 43210',
    department: 'Article Management',
    role: 'Senior Manager',
    employeeId: 'EMP001',
    location: 'Mumbai, India',
    joinDate: '2023-01-15',
    avatar: null
  });

  const [formData, setFormData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profileData);
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profileData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <FaUserCircle className="profile-modal-icon" />
            <h2>Profile</h2>
          </div>
          <div className="profile-modal-actions">
            {!isEditing ? (
              <button className="profile-edit-btn" onClick={handleEdit}>
                <FaEdit />
                Edit
              </button>
            ) : (
              <div className="profile-edit-actions">
                <button className="profile-save-btn" onClick={handleSave}>
                  <FaSave />
                  Save
                </button>
                <button className="profile-cancel-btn" onClick={handleCancel}>
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
            <button className="profile-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="profile-modal-body">
          <div className="profile-content">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-container">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <FaUserCircle />
                  </div>
                )}
                {isEditing && (
                  <label className="profile-avatar-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <FaEdit className="upload-icon" />
                  </label>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="profile-info-section">
              <div className="profile-info-grid">
                {/* Name */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaUser className="profile-info-icon" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaEnvelope className="profile-info-icon" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaPhone className="profile-info-icon" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.phone}</div>
                  )}
                </div>

                {/* Department */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaBuilding className="profile-info-icon" />
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.department}</div>
                  )}
                </div>

                {/* Role */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaUser className="profile-info-icon" />
                    Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.role}</div>
                  )}
                </div>

                {/* Employee ID */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaIdCard className="profile-info-icon" />
                    Employee ID
                  </label>
                  <div className="profile-info-value">{profileData.employeeId}</div>
                </div>

                {/* Location */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaMapMarkerAlt className="profile-info-icon" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="profile-info-input"
                    />
                  ) : (
                    <div className="profile-info-value">{profileData.location}</div>
                  )}
                </div>

                {/* Join Date */}
                <div className="profile-info-item">
                  <label className="profile-info-label">
                    <FaUser className="profile-info-icon" />
                    Join Date
                  </label>
                  <div className="profile-info-value">{profileData.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 