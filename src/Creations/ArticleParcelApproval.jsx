import React, { useState, useEffect } from 'react';
import { FaUser, FaBoxOpen, FaBarcode, FaCheck, FaTimes, FaEye, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { FiEye, FiTrash, FiEdit, FiPlay, FiSearch, FiDownload, FiUpload, FiPlus, FiPackage, FiClock, FiRefreshCw, FiList, FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import ArticleParcelViewModal from './ArticleParcelViewModal.jsx';
import './ArticalParcel.css';

// Column names and definitions (same as ArticleParcel.jsx)
const columnNames = [
  "ART_CR_DATE", "SEG", "DIV", "SUB_DIV", "MAJ_CAT_NM", "MC_DESC", "MC_ST", "MC_CODE", "GEN_ART", "ARTICLE_DESCRIPTION_LONG", "ARTICLE_DESCRIPTION", "HSN_CODE", "VND_CD", "VND_NM", "VND_DZN_NO", "MRP", "NOA", "RNG_SEG", "MAIN_MVGR", "MACRO_MVGR", "YARN", "FAB_WEAVE", "FAB2", "FAB_WEAVE_2", "FAB_STYLE", "FAB_SUB_STYLE", "SHADE", "LYCRA", "GSM", "COUNT", "OUNZ", "FAB_WEIGHT", "COLLAR", "NECK_BAND_STYLE", "COLLAR_SIZE", "PLACKET_CHANGING", "BLT_MAIN_STYLE", "SUB_STYLE_BLT", "BLT_SIZE", "SLEEVES_MAIN_STYLE", "BTFOLD", "SET", "NECK_BAND", "FO_BTN_STYLE", "POCKET", "FIT", "PATTERN", "LENGTH", "MAIN_STYLE", "DC_SUB_STYLE", "DC_EDGE_LOOP", "BTN_MAIN_MVGR", "SUB_STYLE_BTN_CLR", "ZIP", "ZIP_COL", "ADD_ACC", "ACC_COL", "PRINT_TYPE", "PRINT_PLACEMENT", "PRINT_STYLE", "PATCHES", "PATCH_TYPE", "EMBROIDERY", "EMB_TYPE", "PLACEMENT", "ADD_ACC1", "WASH", "WASH_COLOR", "BUYING_TYPE", "PD", "BRAND_VENDOR", "MDM_REMARKS", "DATE", "COLOR1", "SIZE", "SEASON", "SOURCE", "FILE_PATH", "Images"
];

const columnDefinitions = [
  { name: "ART_CR_DATE", type: "date" },
  { name: "SEG", type: "dropdown" },
  { name: "DIV", type: "dropdown" },
  { name: "SUB_DIV", type: "dropdown" },
  { name: "MAJ_CAT_NM", type: "dropdown" },
  { name: "MC_DESC", type: "dropdown" },
  { name: "MC_ST", type: "dropdown" },
  { name: "MC_CODE", type: "dropdown" },
  { name: "GEN_ART", type: "dropdown" },
  { name: "ARTICLE_DESCRIPTION_LONG", type: "text" },
  { name: "ARTICLE_DESCRIPTION", type: "text" },
  { name: "HSN_CODE", type: "text" },
  { name: "VND_CD", type: "text" },
  { name: "VND_NM", type: "text" },
  { name: "VND_DZN_NO", type: "text" },
  { name: "MRP", type: "number" },
  { name: "NOA", type: "number" },
  { name: "RNG_SEG", type: "text" },
  { name: "MAIN_MVGR", type: "text" },
  { name: "MACRO_MVGR", type: "text" },
  { name: "YARN", type: "text" },
  { name: "FAB_WEAVE", type: "text" },
  { name: "FAB2", type: "text" },
  { name: "FAB_WEAVE_2", type: "text" },
  { name: "FAB_STYLE", type: "text" },
  { name: "FAB_SUB_STYLE", type: "text" },
  { name: "SHADE", type: "text" },
  { name: "LYCRA", type: "text" },
  { name: "GSM", type: "number" },
  { name: "COUNT", type: "number" },
  { name: "OUNZ", type: "number" },
  { name: "FAB_WEIGHT", type: "number" },
  { name: "COLLAR", type: "text" },
  { name: "NECK_BAND_STYLE", type: "text" },
  { name: "COLLAR_SIZE", type: "text" },
  { name: "PLACKET_CHANGING", type: "text" },
  { name: "BLT_MAIN_STYLE", type: "text" },
  { name: "SUB_STYLE_BLT", type: "text" },
  { name: "BLT_SIZE", type: "text" },
  { name: "SLEEVES_MAIN_STYLE", type: "text" },
  { name: "BTFOLD", type: "text" },
  { name: "SET", type: "text" },
  { name: "NECK_BAND", type: "text" },
  { name: "FO_BTN_STYLE", type: "text" },
  { name: "POCKET", type: "text" },
  { name: "FIT", type: "text" },
  { name: "PATTERN", type: "text" },
  { name: "LENGTH", type: "text" },
  { name: "MAIN_STYLE", type: "text" },
  { name: "DC_SUB_STYLE", type: "text" },
  { name: "DC_EDGE_LOOP", type: "text" },
  { name: "BTN_MAIN_MVGR", type: "text" },
  { name: "SUB_STYLE_BTN_CLR", type: "text" },
  { name: "ZIP", type: "text" },
  { name: "ZIP_COL", type: "text" },
  { name: "ADD_ACC", type: "text" },
  { name: "ACC_COL", type: "text" },
  { name: "PRINT_TYPE", type: "text" },
  { name: "PRINT_PLACEMENT", type: "text" },
  { name: "PRINT_STYLE", type: "text" },
  { name: "PATCHES", type: "text" },
  { name: "PATCH_TYPE", type: "text" },
  { name: "EMBROIDERY", type: "text" },
  { name: "EMB_TYPE", type: "text" },
  { name: "PLACEMENT", type: "text" },
  { name: "ADD_ACC1", type: "text" },
  { name: "WASH", type: "text" },
  { name: "WASH_COLOR", type: "text" },
  { name: "BUYING_TYPE", type: "text" },
  { name: "PD", type: "text" },
  { name: "BRAND_VENDOR", type: "text" },
  { name: "MDM_REMARKS", type: "text" },
  { name: "DATE", type: "date" },
  { name: "COLOR1", type: "text" },
  { name: "SIZE", type: "text" },
  { name: "SEASON", type: "text" },
  { name: "SOURCE", type: "text" },
  { name: "FILE_PATH", type: "text" },
  { name: "Images", type: "images" }
];

const mainTableColumns = [
  "MC CODE",
  "SEGMENT", 
  "DIVISION",
  "MAJOR CATEGORY",
  "ARTICLE DESCRIPTION",
  "STATUS",
  "IMAGES"
];

const generateRow = (id, status) => {
  const row = { STATUS: status };
  columnNames.forEach((col, idx) => {
    if (col === "STATUS") row[col] = status;
    else if (col.includes("DATE")) row[col] = `2024-07-23`;
    else if (col.includes("QTY") || col.includes("PRICE") || col.includes("%") || col === "COLOR1" || col === "SIZE" || col === "SEASON" || col === "SOURCE") row[col] = Math.floor(Math.random() * 100);
    else if (col === "Images") row[col] = [];
    else row[col] = `${col} ${id}`;
  });
  return row;
};

const statusBadge = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("pending")) return <span className="modern-status-badge modern-status-pending">⏳ Pending</span>;
  if (s.includes("approved")) return <span className="modern-status-badge modern-status-approved">✅ Approved</span>;
  if (s.includes("reject")) return <span className="modern-status-badge modern-status-rejected">❌ Rejected</span>;
  if (s.includes("sent")) return <span className="modern-status-badge modern-status-sent">📤 Sent</span>;
  return <span className="modern-status-badge modern-status-pending">⏳ {status}</span>;
};

const ArticleParcelApproval = () => {
  console.log('🚀 ArticleParcelApproval component loaded');
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleRows, setArticleRows] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('pending');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalRow, setApprovalRow] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState([]);
  const [approvalCheckbox, setApprovalCheckbox] = useState(false);
  const [rejectionCheckbox, setRejectionCheckbox] = useState(false);

  // Handle image error - COMMENTED OUT FOR NOW
  /*
  const handleImageError = (imageUrl, element) => {
    console.log(`🖼️ Image failed to load: ${imageUrl}`);
    
    // Set placeholder image
    element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3I8L3RleHQ+PC9zdmc+';
    element.style.display = 'block';
    element.title = `Image not found: ${imageUrl}`;
    
    // Extract image name for error tracking
    const imageName = imageUrl.split('/').pop() || 'Unknown';
    
    // Add to error list
    setImageErrors(prev => {
      const newErrors = [...prev, imageName];
      return newErrors.slice(-10); // Keep last 10 errors for better tracking
    });
    
    // Show user-friendly message with more specific information
    if (imageErrors.length === 0) {
      setApprovalMessage(`ℹ️ Some images failed to load (404 errors). This is normal if image files don't exist on the server yet.`);
      setTimeout(() => setApprovalMessage(""), 8000);
    }
  };
  */

  // Handle ArticleFiles URLs - fix incorrect base URLs from backend
  const handleArticleFilesUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return imageUrl;
    }
    
    // Fix incorrect base URLs from backend
    if (imageUrl.includes('192.168.151.24:9000')) {
      const fixedUrl = imageUrl.replace('192.168.151.24:9000', '192.168.149.188');
      console.log(`🖼️ Fixed image URL: ${imageUrl} -> ${fixedUrl}`);
      return fixedUrl;
    }
    
    // Keep original URLs if they're already correct
    console.log(`🖼️ Using image URL: ${imageUrl}`);
    return imageUrl;
  };

  // Clear image errors - COMMENTED OUT FOR NOW
  /*
  const clearImageErrors = () => {
    setImageErrors([]);
  };
  */

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      const apiUrl = `${config.asnBaseUrl}/api/Article/GetAllArticleMasterDetail`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      let articlesData = result.data || [];
      
      if (!articlesData || articlesData.length === 0) {
        if (Array.isArray(result)) {
          articlesData = result;
        } else if (result.articles) {
          articlesData = result.articles;
        } else if (result.items) {
          articlesData = result.items;
        } else {
          articlesData = [];
        }
      }
      
      const processedRows = articlesData.map((row, index) => {
        const processedRow = { ...row };
        
        if (processedRow.Images) {
          if (Array.isArray(processedRow.Images)) {
            processedRow.Images = processedRow.Images
              .filter(img => img && img.trim && img.trim() !== '')
              .map(img => handleArticleFilesUrl(img));
          } else if (typeof processedRow.Images === 'string') {
            const imageUrls = processedRow.Images.split(/[,\s;]+/).filter(url => url && url.trim() && url.trim() !== 'null' && url.trim() !== 'undefined');
            processedRow.Images = imageUrls.map(img => handleArticleFilesUrl(img));
          } else {
            processedRow.Images = [];
          }
        } else {
          processedRow.Images = [];
        }
        
        if (processedRow.ArticleId) {
          processedRow.ArticleId = parseInt(processedRow.ArticleId) || 0;
        } else {
          processedRow.ArticleId = 0;
        }
        
        return processedRow;
      });
      
      setArticleRows(processedRows);
      
    } catch (err) {
      console.error('Error fetching articles:', err);
      setApprovalMessage("ℹ️ Using sample data - API server unavailable");
      
      const sampleData = Array.from({ length: 10 }, (_, i) => generateRow(i + 1, ['Pending', 'Pending', 'Pending', 'Approved', 'Rejected'][i % 5]));
      setArticleRows(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (row) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  const handleApprovalAction = (row) => {
    setApprovalRow(row);
    setApprovalModalOpen(true);
    setApprovalCheckbox(false);
    setRejectionCheckbox(false);
    setRejectionReason("");
  };

  const handleRejectionAction = (row) => {
    setApprovalRow(row);
    setApprovalModalOpen(true);
    setApprovalCheckbox(false);
    setRejectionCheckbox(true);
    setRejectionReason("");
  };

  const handleApprove = async () => {
    try {
      // For rejection, require a reason
      if (rejectionCheckbox && !rejectionReason.trim()) {
        setApprovalMessage("❌ Please provide a rejection reason");
        setTimeout(() => setApprovalMessage(""), 3000);
        return;
      }

      if (rejectionCheckbox) {
        // Handle rejection
        setArticleRows(prevRows => 
          prevRows.map(row => 
            row.ArticleId === approvalRow.ArticleId 
              ? { ...row, STATUS: 'Rejected', REJECTION_REASON: rejectionReason, REJECTED_DATE: new Date().toLocaleDateString() }
              : row
          )
        );
        
        setApprovalMessage("❌ Article rejected successfully!");
        setTimeout(() => setApprovalMessage(""), 3000);
      } else {
        // Handle approval
      setArticleRows(prevRows => 
        prevRows.map(row => 
          row.ArticleId === approvalRow.ArticleId 
              ? { ...row, STATUS: 'Approved', APPROVED_DATE: new Date().toLocaleDateString() }
            : row
        )
      );
      
      setApprovalMessage("✅ Article approved successfully!");
      setTimeout(() => setApprovalMessage(""), 3000);
      }
      
      setApprovalModalOpen(false);
      setApprovalRow(null);
      setApprovalCheckbox(false);
      setRejectionCheckbox(false);
      setRejectionReason("");
      
    } catch (error) {
      setApprovalMessage("❌ Error processing article: " + error.message);
      setTimeout(() => setApprovalMessage(""), 5000);
    }
  };

  const handleReject = async () => {
    // This function is now handled by handleApprove with checkbox logic
    handleApprove();
  };

  // Handler for selecting/deselecting a row
  const handleSelectRow = (articleId) => {
    setSelectedRows(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Handler for selecting/deselecting all rows
  const handleSelectAll = () => {
    if (paginatedData.every(row => selectedRows.includes(row["ArticleId"]))) {
      setSelectedRows(prev => prev.filter(id => !paginatedData.some(row => row["ArticleId"] === id)));
    } else {
      setSelectedRows(prev => [
        ...prev,
        ...paginatedData
          .map(row => row["ArticleId"])
          .filter(id => !prev.includes(id))
      ]);
    }
  };

  // Batch approval functionality
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

  // Batch rejection functionality
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
    let filtered = articleRows;
    
    if (searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    if (currentFilter === 'pending') {
      filtered = filtered.filter(row => row.STATUS?.toLowerCase().includes('pending'));
    } else if (currentFilter === 'approved') {
      filtered = filtered.filter(row => row.STATUS?.toLowerCase().includes('approved'));
    } else if (currentFilter === 'rejected') {
      filtered = filtered.filter(row => row.STATUS?.toLowerCase().includes('rejected'));
    }
    
    setDisplayedArticles(filtered);
  }, [articleRows, searchQuery, currentFilter]);

  useEffect(() => {
    fetchLatestData();
  }, []);

  // Filtering and pagination logic
  const filteredData = displayedArticles.filter(row => Object.values(row).join(' ').toLowerCase().includes(searchQuery.toLowerCase()));

  // Pagination logic
  const rowsPerPage = 30;
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
  // Reset to page 1 if filter changes and currentPage is out of range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredData.length, totalPages]);

  return (
    <div className="article-parcel-container">
      {loading && (
        <div className="modern-loading">
          <div className="modern-loading-spinner"></div>
          Loading articles...
        </div>
      )}
      
      {/* Modern Toast Messages */}
      {approvalMessage && (
        <div className={`modern-toast ${approvalMessage.startsWith('✅') ? 'success' : approvalMessage.startsWith('🔄') ? 'info' : approvalMessage.startsWith('📊') ? 'info' : approvalMessage.startsWith('ℹ️') ? 'info' : 'error'}`}>
          <div className="modern-toast-content">
            {approvalMessage.startsWith('✅') ? <FaCheckCircle /> : 
             approvalMessage.startsWith('🔄') ? <FiRefreshCw /> : 
             approvalMessage.startsWith('📊') ? <FiList /> :
             approvalMessage.startsWith('ℹ️') ? <FaInfoCircle /> :
             <FaTimesCircle />}
            <span>{approvalMessage}</span>
            </div>
          <button 
            onClick={() => setApprovalMessage("")}
            className="modern-toast-close"
            title="Close message"
          >
            ×
          </button>
          </div>
      )}
      
      {/* Image Errors Summary - COMMENTED OUT FOR NOW */}
      {/*
      {imageErrors.length > 0 && (
        <div className="modern-toast error" style={{ top: '80px', maxWidth: '500px' }}>
          <div className="modern-toast-content">
            <FaTimesCircle />
            <span>{imageErrors.length} image(s) not found on server (404 errors)</span>
            <small style={{ display: 'block', marginTop: '4px', opacity: 0.8 }}>
              Recent files: {imageErrors.slice(-5).join(', ')}
              {imageErrors.length > 5 && ` (+${imageErrors.length - 5} more)`}
            </small>
            <small style={{ display: 'block', marginTop: '2px', opacity: 0.6, fontSize: '11px' }}>
              This is normal if image files don't exist on the server yet
            </small>
          </div>
          <button 
            onClick={clearImageErrors}
            className="modern-toast-close"
            title="Clear image errors"
          >
            ×
          </button>
        </div>
      )}
      */}
      
      <div className="modern-card">
        {/* Modern Header */}
        <div className="modern-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <h1 className="modern-title" style={{ color: '#ffffff' }}>
              <FiPackage style={{ fontSize: '2.2rem', color: '#1e3a8a' }} />
              Article Parcel Approval
            </h1>
          </div>
        </div>

        {/* Modern Toolbar */}
        <div className="modern-toolbar">
          {/* Search Bar */}
          <div className="modern-search">
            <FiSearch className="modern-search-icon" />
          <input
            type="text"
              placeholder="Search articles, suppliers, LPO, etc…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

          {/* Status Summary */}
          <div className="modern-status-summary">
            <div className="modern-status-item">
              <span className="modern-status-dot pending"></span>
              <span>Pending: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('pending')).length}</span>
            </div>
            <div className="modern-status-item">
              <span className="modern-status-dot approved"></span>
              <span>Approved: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('approved')).length}</span>
            </div>
            <div className="modern-status-item">
              <span className="modern-status-dot rejected"></span>
              <span>Rejected: {articleRows.filter(row => row.STATUS?.toLowerCase().includes('rejected')).length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modern-actions">
        <select
          value={currentFilter}
          onChange={(e) => setCurrentFilter(e.target.value)}
          className="modern-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

            <button className="modern-btn modern-btn-outline" onClick={fetchLatestData}>
              <FiRefreshCw /> Refresh
            </button>
      </div>
      </div>



        {/* Modern Table */}
        <div className="modern-table-container">
          <div className="modern-table-wrapper">
            <table className="modern-table">
            <thead>
                <tr>
                  <th className="fixed-column">
                                         <input
                       type="checkbox"
                       checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.includes(row["ArticleId"]))}
                       onChange={handleSelectAll}
                       style={{ width: '16px', height: '16px' }}
                     />
                  </th>
                  {/* Main table columns */}
                  {mainTableColumns.map((heading, index) => (
                    <th key={index} className="fixed-column">{heading}</th>
                ))}
                  <th className="fixed-column">Actions</th>
              </tr>
            </thead>
            <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={mainTableColumns.length + 2}>
                      No data found. 
                      <br />
                      <small>Debug: Total = {articleRows.length}, Displayed = {displayedArticles.length}, Filtered = {filteredData.length}, Filter = {currentFilter}</small>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, idx) => {
                    const isSelected = selectedRows.includes(row["ArticleId"]);
                    return (
                      <tr key={idx + (currentPage - 1) * rowsPerPage} className={isSelected ? "selected-row" : ""}>
                        <td className="fixed-column">
                                                     <input
                             type="checkbox"
                             checked={isSelected}
                             onChange={() => handleSelectRow(row["ArticleId"])}
                             style={{ width: '16px', height: '16px' }}
                           />
                        </td>
                        {/* Main table columns */}
                        {mainTableColumns.map((header, colIdx) => {
                          // Map display names to actual field names based on API data structure
                          const fieldMap = {
                            "MC CODE": "MC_CODE",
                            "SEGMENT": "SEG", 
                            "DIVISION": "DIV",
                            "MAJOR CATEGORY": "MAJ_CAT_NM",
                            "ARTICLE DESCRIPTION": "ARTICLE_DESCRIPTION",
                            "STATUS": "STATUS",
                            "IMAGES": "Images"
                          };
                          
                          const actualField = fieldMap[header] || header;
                          
                                                     return (
                             <td key={colIdx} className="fixed-column" style={{ textAlign: 'center' }}>
                        {header === "STATUS"
                          ? (
                            <div>
                              {statusBadge(row[actualField])}
                              {row.STATUS?.toLowerCase().includes('rejected') && row.REJECTION_REASON && (
                                <div className="modern-rejection-reason">
                                  <small>Reason: {row.REJECTION_REASON}</small>
                                </div>
                              )}
                            </div>
                          )
                          : header === "IMAGES"
                            ? (() => {
                                const imagesArr =
                                  typeof row.Images === 'string'
                                    ? row.Images.split(/[,\s;]+/).map(url => url.trim()).filter(url => url && url !== 'null' && url !== 'undefined' && url !== '')
                                    : Array.isArray(row.Images)
                                      ? row.Images.filter(img => img && img !== 'null' && img !== 'undefined' && img !== '')
                                      : [];
                               
                               if (!imagesArr || imagesArr.length === 0) {
                                 return (
                                   <div className="modern-image-placeholder">
                                     <img 
                                       src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"
                                       
                                       style={{ 
                                         width: '32px', 
                                         height: '32px',
                                         border: '1px solid #d1d5db',
                                         borderRadius: '6px',
                                         backgroundColor: '#f9fafb'
                                       }}
                                     />
                                   </div>
                                 );
                               }
                               
                               return (
                                 <div className="modern-image-grid">
                                   {imagesArr.slice(0, 2).map((imageUrl, idx) => {
                                     let displayUrl = imageUrl;
                                     
                                     if (imageUrl.startsWith('data:image')) {
                                       displayUrl = imageUrl;
                                     } else if (imageUrl.startsWith('http')) {
                                       // Full URL - keep as is and let error handling deal with 404s
                                       displayUrl = imageUrl;
                                     } else if (imageUrl.startsWith('/')) {
                                       displayUrl = `${config.asnBaseUrl}${imageUrl}`;
                                     } else if (imageUrl.length > 100) {
                                       displayUrl = `data:image/jpeg;base64,${imageUrl}`;
                                     } else {
                                       displayUrl = `${config.asnBaseUrl}/${imageUrl}`;
                                     }
                                     
                                     return (
                                       <img
                                         key={idx}
                                         src={displayUrl}
                                         alt={`Article Image ${idx + 1}`}
                                         style={{
                                           width: '32px',
                                           height: '32px',
                                           objectFit: 'cover',
                                           borderRadius: '6px'
                                         }}
                                         onError={e => { 
                                           e.target.onerror = null; 
                                           // handleImageError(imageUrl, e.target); // COMMENTED OUT
                                         }}
                                       />
                                     );
                                   })}
                                   {imagesArr.length > 2 && (
                                     <div style={{
                                       width: '32px',
                                       height: '32px',
                                       background: 'rgba(102, 126, 234, 0.1)',
                                       borderRadius: '6px',
                                       display: 'flex',
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       fontSize: '10px',
                                       color: '#667eea',
                                       fontWeight: 'bold'
                                     }}>
                                       +{imagesArr.length - 2}
                                     </div>
                                   )}
                                 </div>
                               );
                             })()
                                 : row[actualField]}
                            </td>
                          );
                        })}
                                                <td className="fixed-column">
                                                    <div className="modern-action-buttons" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                            {/* View button for all rows */}
                                   <button
                              className="modern-action-btn modern-action-btn-view"
                                     onClick={() => handleView(row)}
                                     title="View Details"
                               style={{ 
                                 cursor: 'pointer', 
                                 zIndex: 1000,
                                 width: '20px',
                                 height: '20px',
                                 fontSize: '9px',
                                 padding: '0'
                               }}
                                   >
                              <FiEye />
                                   </button>
                                   
                                   {/* Approve button */}
                                   <button
                                     className="modern-action-btn modern-action-btn-success"
                                     onClick={() => handleApprovalAction(row)}
                                     title="Approve Article"
                                     style={{ 
                                       cursor: 'pointer', 
                                       zIndex: 1000,
                                       width: '20px',
                                       height: '20px',
                                       fontSize: '9px',
                                       padding: '0',
                                       backgroundColor: '#10b981',
                                       color: 'white',
                                       border: 'none',
                                       borderRadius: '4px'
                                     }}
                                   >
                                     <FaCheck />
                                   </button>
                                   
                                   {/* Reject button */}
                                   <button
                                     className="modern-action-btn modern-action-btn-delete"
                                     onClick={() => handleRejectionAction(row)}
                                     title="Reject Article"
                                     style={{ 
                                       cursor: 'pointer', 
                                       zIndex: 1000,
                                       width: '20px',
                                       height: '20px',
                                       fontSize: '9px',
                                       padding: '0',
                                       backgroundColor: '#ef4444',
                                       color: 'white',
                                       border: 'none',
                                       borderRadius: '4px'
                                     }}
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
      </div>

        {/* Modern Pagination */}
        <div className="modern-pagination">
          <button 
            className="modern-pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i + 1} 
              className={`modern-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="modern-pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedRow && (
        <ArticleParcelViewModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          rowData={selectedRow}
          columnDefinitions={columnDefinitions}
          readOnly={true}
        />
      )}

      {/* Approval Modal */}
      {approvalModalOpen && approvalRow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              color: '#1e3a8a',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              {rejectionCheckbox ? 'Article Rejection' : 'Article Approval'}
            </h2>
            
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Article: <strong>{approvalRow.ARTICLE_DESCRIPTION}</strong>
            </p>
            
            {/* Action Type Display */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: rejectionCheckbox ? '#fef2f2' : '#f0fdf4',
                border: `2px solid ${rejectionCheckbox ? '#fecaca' : '#bbf7d0'}`,
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: rejectionCheckbox ? '#dc2626' : '#059669'
                }}>
                  {rejectionCheckbox ? (
                    <>
                      <FaTimes style={{ color: '#dc2626' }} />
                      Reject Article
                    </>
                  ) : (
                    <>
                      <FaCheck style={{ color: '#059669' }} />
                      Approve Article
                    </>
                  )}
                </div>
                <p style={{
                  margin: '0.5rem 0 0 0',
                  fontSize: '0.9rem',
                  color: rejectionCheckbox ? '#991b1b' : '#065f46',
                  opacity: 0.8
                }}>
                  {rejectionCheckbox 
                    ? 'This action will reject the article and require a reason.'
                    : 'This action will approve the article for processing.'
                  }
                </p>
              </div>
            </div>
            
            {/* Rejection Reason (only show if reject is selected) */}
            {rejectionCheckbox && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#dc2626'
              }}>
                  Rejection Reason:
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #fecaca',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  minHeight: '100px',
                  resize: 'vertical',
                  backgroundColor: '#fef2f2'
                }}
              />
            </div>
            )}
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setApprovalModalOpen(false);
                  setApprovalRow(null);
                  setApprovalCheckbox(false);
                  setRejectionCheckbox(false);
                  setRejectionReason("");
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: rejectionCheckbox ? '#dc2626' : '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {rejectionCheckbox ? (
                  <>
                    <FaTimes style={{ marginRight: '0.5rem' }} />
                    Reject Article
                  </>
                ) : (
                  <>
                <FaCheck style={{ marginRight: '0.5rem' }} />
                    Approve Article
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleParcelApproval; 