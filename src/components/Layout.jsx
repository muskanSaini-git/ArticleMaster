import React, { useState } from 'react';
import { FaUser, FaBox, FaCheckCircle, FaTimesCircle, FaClock, FaChartLine, FaPlus, FaEye, FaEdit, FaTrash, FaDownload, FaPrint, FaShare, FaRedo, FaUpload, FaSave, FaTimes, FaKey, FaBell, FaCog, FaHistory, FaFilter, FaBars, FaSignOutAlt, FaThumbsUp, FaThumbsDown, FaHourglassHalf, FaFileAlt, FaList } from 'react-icons/fa';
import TopBar from './TopBar';
import './Layout.css';
import MasterDropdown from './MasterDropdown'; // Added MasterDropdown import

const Layout = ({ children, currentPage, onPageChange, accessiblePages = [], user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Restore sidebar to be visible by default
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [masterModalOpen, setMasterModalOpen] = useState(false);
  const [selectedMasterType, setSelectedMasterType] = useState(null);

  const allMenuItems = [
    // Regular items - show for approval, purchase, merchant, and admin roles
    ...(user?.role === 'approval' || user?.role === 'purchase' || user?.role === 'merchant' || user?.role === 'admin' ? [
      { id: 'parcels', label: 'Articles', icon: <FaBox /> },
      { id: 'pending', label: 'Pending', icon: <FaHourglassHalf /> },
      { id: 'approvals', label: 'Approvals', icon: <FaCheckCircle /> },
      { id: 'rejections', label: 'Rejections', icon: <FaTimesCircle /> }
    ] : []),

    // Article Creation role - only show Articles and Create Article
    ...(user?.role === 'article_creation' ? [
      { id: 'parcels', label: 'Articles', icon: <FaBox /> },
      { 
        id: 'article_creation', 
        label: 'Article Creation', 
        icon: <FaPlus />,
        subItems: [
          { id: 'create_article', label: 'Create Article', icon: <FaPlus /> }
        ]
      },
      { id: 'approve_article', label: 'Approve Article', icon: <FaCheckCircle /> },
      { id: 'pending_article', label: 'Pending Article', icon: <FaClock /> },
      { id: 'rejected_article', label: 'Rejected Article', icon: <FaTimesCircle /> }
    ] : []),

    // Article Creation - different menus for different roles
    ...(user?.role === 'admin' ? [
      { 
        id: 'article_creation', 
        label: 'Article Creation', 
        icon: <FaPlus />,
        subItems: [
          { id: 'article_creation_all', label: 'All Articles', icon: <FaEye /> },
          { id: 'article_creation_draft', label: 'Draft Articles', icon: <FaFileAlt /> },
          { id: 'article_creation_pending', label: 'Pending Articles', icon: <FaClock /> },
          { id: 'article_creation_approved', label: 'Approved Articles', icon: <FaCheckCircle /> },
          { id: 'article_creation_rejected', label: 'Rejected Articles', icon: <FaTimesCircle /> }
        ]
      }
    ] : []),
    
    // Master tab - only show for admin role
    ...(user?.role === 'admin' ? [
      { 
        id: 'master', 
        label: 'Master', 
        icon: <FaCog />,
        subItems: [
          { id: 'master_segments', label: 'Segments', icon: <FaList /> },
          { id: 'master_divisions', label: 'Divisions', icon: <FaList /> },
          { id: 'master_subdivisions', label: 'Sub Divisions', icon: <FaList /> },
          { id: 'master_categories', label: 'Major Categories', icon: <FaList /> },
          { id: 'master_descriptions', label: 'MC Descriptions', icon: <FaList /> },
          { id: 'master_mcst', label: 'MCST Details', icon: <FaList /> },
          { id: 'master_vendors', label: 'Vendors', icon: <FaList /> },
          { id: 'master_seasons', label: 'Seasons', icon: <FaList /> },
          { id: 'master_colors', label: 'Colors', icon: <FaList /> },
          { id: 'master_sizes', label: 'Sizes', icon: <FaList /> }
        ]
      }
    ] : [])
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = (menuId) => {
    onPageChange(menuId);
    closeSidebar(); // Close sidebar when menu item is clicked
  };

  const handleSubMenuClick = (menuId) => {
    // Check if it's a master sub-item
    if (menuId.startsWith('master_')) {
      const type = menuId.replace('master_', '');
      setSelectedMasterType(type);
      setMasterModalOpen(true);
      closeSidebar();
    } else {
      onPageChange(menuId);
      closeSidebar(); // Close sidebar when sub-menu item is clicked
    }
  };

  const toggleSubMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleLogout = () => {
    // Handle logout logic here
    if (onLogout) {
      onLogout();
    }
  };

  const closeMasterModal = () => {
    setMasterModalOpen(false);
    setSelectedMasterType(null);
  };

  // Clone children and pass the sidebar toggle function
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onSidebarToggle: toggleSidebar,
        currentPage: currentPage 
      });
    }
    return child;
  });

  return (
    <div className="layout">
      {/* Force Vercel redeploy - UI fixes applied */}
      {/* Sidebar */}
      <div 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1000,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: '240px',
          background: '#ffffff'
        }}
      >
        {/* Logo and Title */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <div className="logo-box logo-box-1"></div>
              <div className="logo-box logo-box-2"></div>
              <div className="logo-box logo-box-3"></div>
            </div>
            <h1 className="app-title">
              {user?.role === 'admin' ? 'Admin Panel' :
               user?.role === 'purchase' ? 'Purchase Order' :
               user?.role === 'merchant' ? 'Merchant Portal' :
               user?.role === 'approval' ? 'Approval System' : 'Master'}
            </h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          {allMenuItems.map((item) => (
            <div key={item.id} className="nav-item">
              {item.subItems ? (
                // Menu item with sub-items (Master tab)
                <div className="nav-item-with-submenu">
                  <button
                    onClick={() => toggleSubMenu(item.id)}
                    className={`nav-button ${currentPage.startsWith(item.id) ? 'active' : ''}`}
                  >
                    <div className="nav-icon">
                      {currentPage.startsWith(item.id) ? item.activeIcon || item.icon : item.icon}
                    </div>
                    <span className="nav-label">{item.label}</span>
                    <div className={`submenu-arrow ${expandedMenu === item.id ? 'expanded' : ''}`}>
                      ▼
                    </div>
                    <div className="hover-indicator"></div>
                  </button>
                  
                  {/* Sub-menu items */}
                  {expandedMenu === item.id && (
                    <div className="submenu">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubMenuClick(subItem.id)}
                          className={`submenu-item ${currentPage === subItem.id ? 'active' : ''}`}
                        >
                          <div className="submenu-icon">
                            {subItem.icon}
                          </div>
                          <span className="submenu-label">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular menu item
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                >
                  <div className="nav-icon">
                    {currentPage === item.id ? item.activeIcon || item.icon : item.icon}
                  </div>
                  <span className="nav-label">{item.label}</span>
                  <div className="hover-indicator"></div>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div 
        className="main-content"
        style={{
          marginLeft: sidebarOpen ? '240px' : '0',
          width: sidebarOpen ? 'calc(100% - 240px)' : '100%',
          minHeight: '100vh'
        }}
        onClick={() => { if (sidebarOpen) closeSidebar(); }}
      >
        {/* TopBar */}
        <TopBar 
          onSidebarToggle={toggleSidebar}
          currentPage={currentPage}
          user={user}
          onLogout={handleLogout}
        />
        
        {/* Content Area */}
        <div className="content-area">
          {childrenWithProps}
        </div>
      </div>

      {/* Click-outside overlay to close sidebar */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 999 }}
        />
      )}

      {/* Master Modal */}
      {masterModalOpen && selectedMasterType && (
        <div className="master-modal-overlay">
          <div className="master-modal">
            <div className="master-modal-header">
              <h2>Master Dropdown Management</h2>
              <button className="master-modal-close" onClick={closeMasterModal}>
                <FaTimes />
              </button>
            </div>
            <div className="master-modal-body">
              <MasterDropdown 
                userRole={user?.role} 
                type={selectedMasterType}
                onClose={closeMasterModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout; 