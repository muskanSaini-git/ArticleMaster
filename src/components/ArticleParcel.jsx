import React, { useState } from "react";
import { FiEye, FiTrash, FiEdit, FiPlay, FiSearch, FiDownload, FiUpload, FiPlus, FiPackage, FiClock, FiRefreshCw, FiList } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaInfoCircle } from "react-icons/fa";
import "./ArticleParcel.css";

const ArticleParcel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('parcels');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="article-parcel-container">
      {/* Sidebar Toggle Button */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      >
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Article Parcel</h2>
          <button className="close-btn" onClick={toggleSidebar}>&times;</button>
        </div>

        {/* Sidebar Tabs */}
        <div className="sidebar-tabs">
          <button 
            className={`tab-btn ${activeTab === 'parcels' ? 'active' : ''}`}
            onClick={() => handleTabChange('parcels')}
          >
            Parcels
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => handleTabChange('tracking')}
          >
            Tracking
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content">
          {activeTab === 'parcels' && (
            <div className="parcels-section">
              <h3>Parcel Management</h3>
              <div className="parcel-list">
                <div className="parcel-item">
                  <div className="parcel-info">
                    <h4>Article #001</h4>
                    <p>Status: Pending</p>
                    <p>Created: 2024-01-15</p>
                  </div>
                  <div className="parcel-actions">
                    <button className="action-btn">View</button>
                    <button className="action-btn">Edit</button>
                  </div>
                </div>
                <div className="parcel-item">
                  <div className="parcel-info">
                    <h4>Article #002</h4>
                    <p>Status: Approved</p>
                    <p>Created: 2024-01-14</p>
                  </div>
                  <div className="parcel-actions">
                    <button className="action-btn">View</button>
                    <button className="action-btn">Edit</button>
                  </div>
                </div>
              </div>
              <button className="add-parcel-btn">+ Add New Parcel</button>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="tracking-section">
              <h3>Tracking</h3>
              <div className="tracking-form">
                <input 
                  type="text" 
                  className="tracking-input" 
                  placeholder="Enter tracking number..."
                />
                <button className="track-btn">Track</button>
              </div>
              <div className="tracking-history">
                <h4>Recent Tracking</h4>
                <div className="tracking-item">
                  <span>Article #001</span>
                  <span>In Transit</span>
                </div>
                <div className="tracking-item">
                  <span>Article #002</span>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default ArticleParcel;
