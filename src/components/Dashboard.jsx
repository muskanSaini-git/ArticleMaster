import React, { useState, useEffect } from 'react';
import { FaChartBar, FaEye, FaEdit, FaCheckCircle, FaTimesCircle, FaClock, FaDownload, FaPrint, FaShare, FaSearch, FaSync, FaTable, FaTh, FaInfoCircle } from 'react-icons/fa';
import { FiGrid, FiPackage, FiTrendingUp, FiUsers, FiFileText, FiSettings } from 'react-icons/fi';
import TopBar from './TopBar';
import './Dashboard.css';

const Dashboard = ({ onSidebarToggle }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalArticles: 1250,
    pendingArticles: 342,
    approvedArticles: 756,
    rejectedArticles: 152,
    totalImages: 4876,
    totalUsers: 24,
    systemHealth: 98
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const MetricCard = ({ title, value, icon, color, subtitle, graphData, graphType = 'line', buttons }) => (
    <div className="metric-card" style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: `${color}10`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}>
            {icon}
          </div>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {title}
          </span>
        </div>
        
        {buttons && (
          <div style={{
            display: 'flex',
            gap: '4px'
          }}>
            {buttons.map((btn, index) => (
              <button
                key={index}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb',
                  background: btn.active ? '#3b82f6' : 'white',
                  color: btn.active ? 'white' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      {subtitle && (
        <p style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          {subtitle}
        </p>
      )}
      
      {graphData && (
        <div style={{ marginTop: '16px', height: '60px' }}>
          {graphType === 'line' && (
            <div style={{ position: 'relative', height: '100%' }}>
              <svg width="100%" height="60" style={{ overflow: 'visible' }}>
                {/* Y-axis labels */}
                <text x="0" y="10" fontSize="10" fill="#9ca3af">4k</text>
                <text x="0" y="20" fontSize="10" fill="#9ca3af">3k</text>
                <text x="0" y="30" fontSize="10" fill="#9ca3af">2k</text>
                <text x="0" y="40" fontSize="10" fill="#9ca3af">1k</text>
                <text x="0" y="50" fontSize="10" fill="#9ca3af">0</text>
                
                {/* X-axis label */}
                <text x="50%" y="58" fontSize="10" fill="#9ca3af" textAnchor="middle">Aug 6</text>
                
                {/* Single data point like image */}
                <circle
                  cx="80"
                  cy="10"
                  r="3"
                  fill={color}
                />
              </svg>
            </div>
          )}
          {graphType === 'bar' && (
            <div style={{ position: 'relative', height: '100%' }}>
              <svg width="100%" height="60" style={{ overflow: 'visible' }}>
                {/* Y-axis labels */}
                <text x="0" y="10" fontSize="10" fill="#9ca3af">50</text>
                <text x="0" y="20" fontSize="10" fill="#9ca3af">45</text>
                <text x="0" y="30" fontSize="10" fill="#9ca3af">30</text>
                <text x="0" y="40" fontSize="10" fill="#9ca3af">15</text>
                <text x="0" y="50" fontSize="10" fill="#9ca3af">0</text>
                
                {/* X-axis label */}
                <text x="50%" y="58" fontSize="10" fill="#9ca3af" textAnchor="middle">Write mode</text>
                
                {/* Single bar like image */}
                <rect
                  x="30"
                  y="10"
                  width="40"
                  height="40"
                  fill={color}
                  rx="2"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const SmallMetricCard = ({ title, value, icon, color, progress, showInfo = false }) => (
    <div className="small-metric-card" style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '8px'
      }}>
        {showInfo && (
          <FaInfoCircle style={{ fontSize: '12px', color: '#9ca3af' }} />
        )}
        <span style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          {title}
        </span>
          </div>

      <div style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px'
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
      
      {progress && (
        <div style={{
          width: '100%',
          height: '4px',
          background: '#f3f4f6',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '8px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: color,
            borderRadius: '2px'
          }} />
                  </div>
      )}
              </div>
  );

  return (
    <div className="dashboard-container">
      <TopBar onSidebarToggle={onSidebarToggle} currentPage="dashboard" />
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
              </div>
      )}

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <FaChartBar style={{ fontSize: '1.5rem', color: '#3b82f6', marginRight: '12px' }} />
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 2px 0'
              }}>
                Article Management Dashboard
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0'
              }}>
                Analytics update every three hours
              </p>
            </div>
          </div>

          <div className="dashboard-date">
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              07/08/2025 to 08/06/2025
            </span>
          </div>
        </div>

        {/* Top Row - Three Large Cards */}
        <div className="metrics-grid-large">
          <MetricCard
            title="Total Articles"
            value={stats.totalArticles}
            icon={<FiPackage style={{ fontSize: '16px' }} />}
            color="#3b82f6"
            subtitle="All articles in system"
          />
          
          <MetricCard
            title="Pending Articles"
            value={stats.pendingArticles}
            icon={<FaClock style={{ fontSize: '16px' }} />}
            color="#f59e0b"
            subtitle="Awaiting approval"
            graphData={[4142]}
            graphType="line"
            buttons={[
              { label: 'PENDING', active: true },
              { label: 'ALL', active: false }
            ]}
          />
          
          <MetricCard
            title="Approved Articles"
            value={stats.approvedArticles}
            icon={<FaCheckCircle style={{ fontSize: '16px' }} />}
            color="#10b981"
            subtitle="Successfully approved"
          />
          </div>

        {/* Middle Row - Two Medium Cards */}
        <div className="metrics-grid-medium">
          <MetricCard
            title="Total Images"
            value={stats.totalImages}
            icon={<FaEye style={{ fontSize: '16px' }} />}
            color="#8b5cf6"
            subtitle="Product images uploaded"
            graphData={[50]}
            graphType="bar"
          />
          
          <MetricCard
            title="Active Users"
            value={stats.totalUsers}
            icon={<FiUsers style={{ fontSize: '16px' }} />}
            color="#06b6d4"
            subtitle="Currently online"
            graphData={[100]}
            graphType="line"
          />
        </div>

        {/* Bottom Section - Two Columns */}
        <div className="dashboard-bottom">
          {/* Left Column */}
          <div className="left-column">
            <MetricCard
              title="System Health"
              value={`${stats.systemHealth}%`}
              icon={<FiSettings style={{ fontSize: '16px' }} />}
              color="#10b981"
              subtitle="All systems operational"
              progress={stats.systemHealth}
            />
            
            <MetricCard
              title="Rejected Articles"
              value={stats.rejectedArticles}
              icon={<FaTimesCircle style={{ fontSize: '16px' }} />}
              color="#ef4444"
              subtitle="Requires revision"
            />
          </div>

          {/* Right Column - Grid of Small Cards */}
          <div className="right-column">
            <div className="small-metrics-grid">
              <SmallMetricCard
                title="Total Categories"
                value={24}
                icon={<FiGrid style={{ fontSize: '12px' }} />}
                color="#3b82f6"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Total Divisions"
                value={8}
                icon={<FiFileText style={{ fontSize: '12px' }} />}
                color="#f59e0b"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Total Segments"
                value={12}
                icon={<FiPackage style={{ fontSize: '12px' }} />}
                color="#8b5cf6"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Average Processing Time"
                value="2.5h"
                icon={<FaClock style={{ fontSize: '12px' }} />}
                color="#06b6d4"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Success Rate"
                value="94%"
                icon={<FaCheckCircle style={{ fontSize: '12px' }} />}
                color="#ef4444"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Total Exports"
                value={156}
                icon={<FaDownload style={{ fontSize: '12px' }} />}
                color="#10b981"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="System Uptime"
                value="99.9%"
                icon={<FiSettings style={{ fontSize: '12px' }} />}
                color="#8b5cf6"
                showInfo={true}
              />
              
              <SmallMetricCard
                title="Data Accuracy"
                value="98.5%"
                icon={<FaSearch style={{ fontSize: '12px' }} />}
                color="#f59e0b"
                showInfo={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 