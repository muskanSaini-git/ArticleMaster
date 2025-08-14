import React, { useState } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import ParcelsList from './components/ParcelsList';
import PendingParcels from './components/PendingParcels';
import Approvals from './components/Approvals';
import Rejections from './components/Rejections';
import Profile from './components/Profile';
import MasterDropdown from './components/MasterDropdown';

// Creations folder imports
import ArticleParcel from './Creations/ArticalParcel';
import ArticleParcelViewModal from './Creations/ArticleParcelViewModal';
import ArticleParcelApproval from './Creations/ArticleParcelApproval';

// Import toast service for global notifications
import './utils/toastService';

// Hybrid mode components
// import HybridModeToggle from './components/HybridModeToggle';


import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('parcels'); // Default to parcels
  // const [hybridModeEnabled, setHybridModeEnabled] = useState(true); // Hybrid mode enabled by default

  const handleLogin = (userData, internalRole) => {
    // Create user object with both original data and mapped role
    const userObject = {
      ...userData,
      role: internalRole // Use the mapped internal role
    };
    
    setUser(userObject);
    
    // Set initial page based on user role
    if (internalRole === 'admin') {
      setCurrentPage('parcels'); // Admin goes to parcels (all articles) by default
    } else if (internalRole === 'article_creation') {
      setCurrentPage('article_creation'); // Article Creation role goes directly to creation page
    } else {
      setCurrentPage('parcels'); // Default to parcels for other roles
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('parcels'); // Default to parcels
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Role-based access control
  const getAccessiblePages = (userRole) => {
    console.log('🔍 App Debug - Getting accessible pages for role:', userRole);
    
    let pages = [];
    switch (userRole) {

      case 'approval':
        pages = ['parcels', 'pending', 'approvals', 'rejections', 'profile'];
        break;
      case 'purchase':
        pages = ['parcels', 'pending', 'approvals', 'rejections', 'profile']; // PO users can view and approve articles
        break;
      case 'merchant':
        pages = ['parcels', 'pending', 'approvals', 'rejections', 'profile']; // Merchant users can view and manage articles
        break;
      case 'admin':
        pages = ['parcels', 'pending', 'approvals', 'rejections', 'article_creation', 'article_creation_all', 'article_creation_draft', 'article_creation_pending', 'article_creation_approved', 'article_creation_rejected', 'master', 'master_segments', 'master_divisions', 'master_subdivisions', 'master_categories', 'master_descriptions', 'master_mcst', 'master_vendors', 'master_seasons', 'master_colors', 'master_sizes', 'profile'];
        break;
      case 'article_creation':
        pages = ['parcels', 'article_creation', 'create_article', 'approve_article', 'pending_article', 'rejected_article', 'profile']; // Added new tabs
        break;
      default:
        pages = ['parcels', 'profile'];
        break;
    }
    
    console.log('🔍 App Debug - Accessible pages for', userRole, ':', pages);
    return pages;
  };

  const canAccessPage = (page, userRole) => {
    const accessiblePages = getAccessiblePages(userRole);
    return accessiblePages.includes(page);
  };

  const renderPage = () => {
    // Check if user has access to current page
    if (!canAccessPage(currentPage, user?.role)) {
      // For admin role, default to ArticleParcel page
      if (user?.role === 'admin') {
        return <ArticleParcel userRole={user?.role} currentTab={1} />;
      }
      // For other roles, default to ParcelsList
      return <ParcelsList userRole={user?.role} />;
    }

    switch (currentPage) {
      // Main navigation routes
      case 'parcels':
        return <ParcelsList userRole={user?.role} />;
      case 'pending':
        return <PendingParcels userRole={user?.role} />;
      case 'approvals':
        return <Approvals userRole={user?.role} />;
      case 'rejections':
        return <Rejections userRole={user?.role} />;
      
      // Article Creation routes (admin only)
      case 'article_creation':
        return <ArticleParcel userRole={user?.role} currentTab={1} />;
      case 'article_creation_all':
        return <ArticleParcel userRole={user?.role} currentTab={1} />;
      case 'article_creation_draft':
        return <ArticleParcel userRole={user?.role} currentTab={5} />; // Draft tab
      case 'article_creation_pending':
        return <ArticleParcel userRole={user?.role} currentTab={2} />; // Pending tab
      case 'article_creation_approved':
        return <ArticleParcel userRole={user?.role} currentTab={3} />; // Approved tab
      case 'article_creation_rejected':
        return <ArticleParcel userRole={user?.role} currentTab={4} />; // Rejected tab
      case 'create_article':
        return <ArticleParcel userRole={user?.role} currentTab={1} />; // Default to create article form
      
      // Article Creation role specific routes
      case 'approve_article':
        return <ArticleParcel userRole={user?.role} currentTab={3} />; // Show approved articles
      case 'pending_article':
        return <ArticleParcel userRole={user?.role} currentTab={2} />; // Show pending articles
      case 'rejected_article':
        return <ArticleParcel userRole={user?.role} currentTab={4} />; // Show rejected articles
      
      // Master routes (admin only)
      case 'master':
        return <div className="master-placeholder">
          <h2>Master Management</h2>
          <p>Master data management coming soon...</p>
        </div>;
      case 'master_segments':
        return <div className="master-placeholder">
          <h2>Segments Management</h2>
          <p>Segments management coming soon...</p>
        </div>;
      case 'master_divisions':
        return <div className="master-placeholder">
          <h2>Divisions Management</h2>
          <p>Divisions management coming soon...</p>
        </div>;
      case 'master_subdivisions':
        return <div className="master-placeholder">
          <h2>Sub Divisions Management</h2>
          <p>Sub Divisions management coming soon...</p>
        </div>;
      case 'master_categories':
        return <div className="master-placeholder">
          <h2>Major Categories Management</h2>
          <p>Major Categories management coming soon...</p>
        </div>;
      case 'master_descriptions':
        return <div className="master-placeholder">
          <h2>MC Descriptions Management</h2>
          <p>MC Descriptions management coming soon...</p>
        </div>;
      case 'master_mcst':
        return <div className="master-placeholder">
          <h2>MCST Details Management</h2>
          <p>MCST Details management coming soon...</p>
        </div>;
      case 'master_vendors':
        return <div className="master-placeholder">
          <h2>Vendors Management</h2>
          <p>Vendors management coming soon...</p>
        </div>;
      case 'master_seasons':
        return <div className="master-placeholder">
          <h2>Seasons Management</h2>
          <p>Seasons management coming soon...</p>
        </div>;
      case 'master_colors':
        return <div className="master-placeholder">
          <h2>Colors Management</h2>
          <p>Colors management coming soon...</p>
        </div>;
      case 'master_sizes':
        return <div className="master-placeholder">
          <h2>Sizes Management</h2>
          <p>Sizes management coming soon...</p>
        </div>;
      
      // Profile and settings
      case 'profile':
        return <Profile userRole={user?.role} />;
      case 'settings':
        return <div className="settings-placeholder">
          <h2>Settings</h2>
          <p>Settings page coming soon...</p>
        </div>;
      
      default:
        // Default based on role
        if (user?.role === 'admin') {
          return <ArticleParcel userRole={user?.role} currentTab={1} />;
        }
        return <ParcelsList userRole={user?.role} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {/* <HybridModeToggle 
        onToggle={setHybridModeEnabled} 
        isEnabled={hybridModeEnabled} 
      /> */}
      <Layout
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        accessiblePages={getAccessiblePages(user.role)}
      >
        {renderPage()}
      </Layout>
    </>
  );
}

export default App;
