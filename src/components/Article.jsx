import React, { useState, useEffect } from 'react';
import { FaUser, FaBoxOpen, FaBarcode, FaCheck, FaTimes, FaEye, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaInfoCircle } from 'react-icons/fa';
import { FiEye, FiTrash, FiEdit, FiSearch, FiDownload, FiUpload, FiPlus, FiPackage, FiClock, FiRefreshCw, FiList } from "react-icons/fi";
import './Article.css';

const Article = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleRows, setArticleRows] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('pending');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalMessage, setApprovalMessage] = useState("");

  // Sample data generation
  const generateRow = (id, status) => {
    return {
      ArticleId: id,
      MC_CODE: `MC${id.toString().padStart(3, '0')}`,
      SEG: `Segment ${id}`,
      DIV: `Division ${id}`,
      MAJ_CAT_NM: `Category ${id}`,
      ARTICLE_DESCRIPTION: `Article Description ${id}`,
      STATUS: status,
      Images: []
    };
  };

  const statusBadge = (status) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s.includes("pending")) return <span className="status-badge status-pending">⏳ Pending</span>;
    if (s.includes("approved")) return <span className="status-badge status-approved">✅ Approved</span>;
    if (s.includes("reject")) return <span className="status-badge status-rejected">❌ Rejected</span>;
    return <span className="status-badge status-pending">⏳ {status}</span>;
  };

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleData = Array.from({ length: 15 }, (_, i) => 
        generateRow(i + 1, ['Pending', 'Pending', 'Pending', 'Approved', 'Rejected'][i % 5])
      );
      setArticleRows(sampleData);
      
    } catch (err) {
      console.error('Error fetching articles:', err);
      setApprovalMessage("ℹ️ Using sample data - API server unavailable");
      
      const sampleData = Array.from({ length: 10 }, (_, i) => 
        generateRow(i + 1, ['Pending', 'Pending', 'Pending', 'Approved', 'Rejected'][i % 5])
      );
      setArticleRows(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = (row) => {
    setArticleRows(prevRows => 
      prevRows.map(item => 
        item.ArticleId === row.ArticleId 
          ? { ...item, STATUS: 'Approved', APPROVED_DATE: new Date().toLocaleDateString() }
          : item
      )
    );
    
    setApprovalMessage("✅ Article approved successfully!");
    setTimeout(() => setApprovalMessage(""), 3000);
  };

  const handleRejectionAction = (row) => {
    setArticleRows(prevRows => 
      prevRows.map(item => 
        item.ArticleId === row.ArticleId 
          ? { ...item, STATUS: 'Rejected', REJECTION_REASON: 'Rejected by user', REJECTED_DATE: new Date().toLocaleDateString() }
          : item
      )
    );
    
    setApprovalMessage("❌ Article rejected successfully!");
    setTimeout(() => setApprovalMessage(""), 3000);
  };

  const handleSelectRow = (articleId) => {
    setSelectedRows(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = () => {
    if (paginatedData.every(row => selectedRows.includes(row.ArticleId))) {
      setSelectedRows(prev => prev.filter(id => !paginatedData.some(row => row.ArticleId === id)));
    } else {
      setSelectedRows(prev => [
        ...prev,
        ...paginatedData
          .map(row => row.ArticleId)
          .filter(id => !prev.includes(id))
      ]);
    }
  };

  const handleBatchApproval = () => {
    if (selectedRows.length === 0) {
      setApprovalMessage("❌ Please select articles to approve");
      setTimeout(() => setApprovalMessage(""), 3000);
      return;
    }
    
    setArticleRows(prevRows => 
      prevRows.map(row => 
        selectedRows.includes(row.ArticleId) 
          ? { ...row, STATUS: 'Approved', APPROVED_DATE: new Date().toLocaleDateString() }
          : row
      )
    );
    
    setApprovalMessage(`✅ ${selectedRows.length} article(s) approved successfully!`);
    setTimeout(() => setApprovalMessage(""), 3000);
    setSelectedRows([]);
  };

  const handleBatchRejection = () => {
    if (selectedRows.length === 0) {
      setApprovalMessage("❌ Please select articles to reject");
      setTimeout(() => setApprovalMessage(""), 3000);
      return;
    }
    
    setArticleRows(prevRows => 
      prevRows.map(row => 
        selectedRows.includes(row.ArticleId) 
          ? { ...row, STATUS: 'Rejected', REJECTION_REASON: 'Batch rejection', REJECTED_DATE: new Date().toLocaleDateString() }
          : row
      )
    );
    
    setApprovalMessage(`❌ ${selectedRows.length} article(s) rejected successfully!`);
    setTimeout(() => setApprovalMessage(""), 3000);
    setSelectedRows([]);
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  // Filtering and pagination logic
  const filteredData = articleRows.filter(row => {
    const matchesSearch = Object.values(row).join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === 'all' || row.STATUS?.toLowerCase().includes(currentFilter);
    return matchesSearch && matchesFilter;
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="article-container">
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading articles...
        </div>
      )}
      
      {/* Toast Messages */}
      {approvalMessage && (
        <div className={`toast ${approvalMessage.startsWith('✅') ? 'success' : 'error'}`}>
          <div className="toast-content">
            {approvalMessage.startsWith('✅') ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{approvalMessage}</span>
          </div>
          <button 
            onClick={() => setApprovalMessage("")}
            className="toast-close"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="article-card">
        {/* Header */}
        <div className="article-header">
          <div className="header-content">
            <h1 className="article-title">
              <FiPackage className="title-icon" />
              Article Parcel Approval
            </h1>
          </div>
        </div>

        {/* Toolbar */}
        <div className="article-toolbar">
          {/* Search Bar */}
          <div className="search-section">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Status Summary */}
          <div className="status-summary">
            <div className="status-item">
              <span className="status-dot pending"></span>
              <span>Pending: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('pending')).length}</span>
            </div>
            <div className="status-item">
              <span className="status-dot approved"></span>
              <span>Approved: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('approved')).length}</span>
            </div>
            <div className="status-item">
              <span className="status-dot rejected"></span>
              <span>Rejected: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('rejected')).length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <select
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button className="btn btn-outline" onClick={fetchLatestData}>
              <FiRefreshCw /> Refresh
            </button>
            
            <button className="btn btn-success" onClick={handleBatchApproval}>
              <FaCheck /> Batch Approve
            </button>
            
            <button className="btn btn-danger" onClick={handleBatchRejection}>
              <FaTimes /> Batch Reject
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="article-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row.ArticleId))}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>MC CODE</th>
                <th>SEGMENT</th>
                <th>DIVISION</th>
                <th>MAJOR CATEGORY</th>
                <th>ARTICLE DESCRIPTION</th>
                <th>STATUS</th>
                <th>IMAGES</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    No data found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const isSelected = selectedRows.includes(row.ArticleId);
                  return (
                    <tr key={idx} className={isSelected ? "selected-row" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.ArticleId)}
                        />
                      </td>
                      <td>{row.MC_CODE}</td>
                      <td>{row.SEG}</td>
                      <td>{row.DIV}</td>
                      <td>{row.MAJ_CAT_NM}</td>
                      <td>{row.ARTICLE_DESCRIPTION}</td>
                      <td>
                        <div>
                          {statusBadge(row.STATUS)}
                          {row.STATUS?.toLowerCase().includes('rejected') && row.REJECTION_REASON && (
                            <div className="rejection-reason">
                              <small>Reason: {row.REJECTION_REASON}</small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="image-placeholder">
                          <img 
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"
                            alt="No Image"
                            className="placeholder-image"
                          />
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-row">
                          <button
                            className="action-btn action-btn-view"
                            onClick={() => console.log('View:', row)}
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          
                          <button
                            className="action-btn action-btn-success"
                            onClick={() => handleApprovalAction(row)}
                            title="Approve Article"
                          >
                            <FaCheck />
                          </button>
                          
                          <button
                            className="action-btn action-btn-danger"
                            onClick={() => handleRejectionAction(row)}
                            title="Reject Article"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i + 1} 
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Article; 