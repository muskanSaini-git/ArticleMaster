import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import ParcelsList from './components/ParcelsList';
import PendingParcels from './components/PendingParcels';
import Approvals from './components/Approvals';
import Rejections from './components/Rejections';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import MasterDropdown from './components/MasterDropdown';

// Creations folder imports
import ArticleParcel from './Creations/ArticalParcel';
import ArticleParcelViewModal from './Creations/ArticleParcelViewModal';
import ArticleParcelApproval from './Creations/ArticleParcelApproval';

// Import toast service for global notifications
import './utils/toastService';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main App Component with Router
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData, internalRole) => {
    // Create user object with both original data and mapped role
    const userObject = {
      ...userData,
      role: internalRole // Use the mapped internal role
    };
    
    setUser(userObject);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Simple role-based access control based on project flow
  const getAccessiblePages = (userRole) => {
    console.log('🔍 App Debug - Getting accessible pages for role:', userRole);
    
    let pages = [];
    switch (userRole) {
      case 'article_creation':
        // Article Creation Role: Create articles and send for approval
        pages = ['create_article', 'approved_articles', 'pending_approval', 'reject_article', 'profile', 'edit-profile'];
        break;
      case 'approval':
        // Approval Role (PO + Merchant): Receive and approve/reject articles
        pages = ['all_articles', 'pending_approvals', 'approved_articles', 'rejected_articles', 'profile', 'edit-profile'];
        break;
      case 'admin':
        // Admin Role: Create articles and approve/reject from admin side
        pages = ['all_articles', 'pending_approvals', 'approved_articles', 'rejected_articles', 'create_article', 'master_management', 'profile', 'edit-profile'];
        break;
      default:
        pages = ['profile', 'edit-profile'];
        break;
    }
    
    console.log('🔍 App Debug - Accessible pages for', userRole, ':', pages);
    return pages;
  };

  const canAccessPage = (page, userRole) => {
    const accessiblePages = getAccessiblePages(userRole);
    return accessiblePages.includes(page);
  };

  // Get default page based on user role
  const getDefaultPage = (userRole) => {
    switch (userRole) {
      case 'article_creation':
        return 'create_article';
      case 'approval':
        return 'all_articles';
      case 'admin':
        return 'all_articles';
      default:
        return 'create_article';
    }
  };

  // Dashboard component that handles routing internally
  const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract current page from URL path
    const getCurrentPageFromPath = (pathname) => {
      const path = pathname.split('/')[1] || 'create_article';
      return path;
    };

    const currentPage = getCurrentPageFromPath(location.pathname);

    const handlePageChange = (page) => {
      navigate(`/${page}`);
  };

  const renderPage = () => {
    // Check if user has access to current page
    if (!canAccessPage(currentPage, user?.role)) {
        // Redirect to first accessible page
        const accessiblePages = getAccessiblePages(user?.role);
        if (accessiblePages.length > 0) {
          navigate(`/${accessiblePages[0]}`);
          return null;
        }
        return <div>Access Denied</div>;
    }

    switch (currentPage) {
        // Article Creation Role Routes
        case 'create_article':
          return <ArticleParcel userRole={user?.role} currentTab={1} />;
        case 'approved_articles':
          return <Approvals userRole={user?.role} />;
        case 'pending_approval':
          return <PendingParcels userRole={user?.role} />;
        case 'reject_article':
          return <Rejections userRole={user?.role} />;
        
        // Approval Role Routes
        case 'all_articles':
        return <ParcelsList userRole={user?.role} />;
        case 'pending_approvals':
        return <PendingParcels userRole={user?.role} />;
        case 'approved_articles':
        return <Approvals userRole={user?.role} />;
        case 'rejected_articles':
        return <Rejections userRole={user?.role} />;
      
        // Admin Role Routes
        case 'all_articles':
          return <ParcelsList userRole={user?.role} />;
        case 'pending_approvals':
          return <PendingParcels userRole={user?.role} />;
        case 'approved_articles':
          return <Approvals userRole={user?.role} />;
        case 'rejected_articles':
          return <Rejections userRole={user?.role} />;
        case 'create_article':
        return <ArticleParcel userRole={user?.role} currentTab={1} />;
        case 'master_management':
          return <MasterDropdown userRole={user?.role} />;
        
        // Common Routes
      case 'profile':
        return <Profile userRole={user?.role} />;
        case 'edit-profile':
          return <EditProfile userRole={user?.role} onPageChange={handlePageChange} />;
      
      default:
          // Default to first accessible page
          const accessiblePages = getAccessiblePages(user?.role);
          if (accessiblePages.length > 0) {
            navigate(`/${accessiblePages[0]}`);
            return null;
          }
          return <div>Access Denied</div>;
      }
    };

  return (
      <Layout
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        accessiblePages={getAccessiblePages(user.role)}
      >
        {renderPage()}
      </Layout>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to={`/${getDefaultPage(user?.role)}`} replace /> : <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute user={user}>
              <Navigate to={`/${getDefaultPage(user?.role)}`} replace />
            </ProtectedRoute>
          } 
        />
        
        {/* Article Creation Role Routes */}
        <Route 
          path="/create_article" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/approved_articles" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pending_approval" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reject_article" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        {/* Approval Role Routes */}
        <Route 
          path="/all_articles" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/pending_approvals" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/approved_articles" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/rejected_articles" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Role Routes */}
        <Route 
          path="/all_articles" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/master_management" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        {/* Common Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to first accessible page */}
        <Route 
          path="*" 
          element={
            user ? <Navigate to={`/${getDefaultPage(user?.role)}`} replace /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
