import React, { useState, useEffect } from 'react';
import { FaTimesCircle, FaEye, FaDownload, FaPrint, FaShare, FaSearch, FaSync, FaTable, FaTh, FaCheck, FaClock, FaTimes, FaEdit, FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { FiEye, FiTable, FiGrid, FiPackage } from "react-icons/fi";
import TopBar from './TopBar';
import ViewModal from './ViewModal';
import EditModal from './EditModal';
import StatusBadge from './StatusBadge';
import GridView from './GridView';
import './Rejections.css';
import './UnifiedModal.css';

// Generate static sample data for rejected parcels
const generateRejectedData = () => {
  const data = [];
  const segments = ['SEG-A', 'SEG-B', 'SEG-C', 'SEG-D'];
  const divisions = ['DIV-1', 'DIV-2', 'DIV-3', 'DIV-4'];
  const categories = ['Casual Wear', 'Formal Wear', 'Sportswear', 'Outerwear'];
  const descriptions = [
    'Cotton T-Shirt with Print Design',
    'Denim Jeans with Stretch',
    'Polo Shirt with Logo',
    'Hooded Sweatshirt',
    'Cargo Pants with Pockets',
    'Dress Shirt with Collar',
    'Athletic Shorts',
    'Winter Jacket',
    'Summer Dress',
    'Work Uniform'
  ];

  for (let i = 1; i <= 50; i++) {
    const segment = segments[i % 4];
    const division = divisions[i % 4];
    const category = categories[i % 4];
    const description = descriptions[i % 10];

    data.push({
      ArticleId: i,
      MC_CODE: `MC${String(i).padStart(3, '0')}`,
      SEG: segment,
      DIV: division,
      MAJ_CAT_NM: category,
      ARTICLE_DESCRIPTION: `${description} - Style ${i}`,
      STATUS: 'Rejected',
      REJECTION_REASON: `Quality standards not met for ${description} - Style ${i}. Requires improvement in material and design.`,
      Images: [
        `https://picsum.photos/100/100?random=${i + 200}`,
        `https://picsum.photos/100/100?random=${i + 201}`,
        `https://picsum.photos/100/100?random=${i + 202}`
      ],
      // Additional fields for completeness
      ART_CR_DATE: '2024-01-15',
      SUB_DIV: `SUB-${i}`,
      MC_DESC: `Description for MC${String(i).padStart(3, '0')}`,
      MC_ST: 'Active',
      GEN_ART: `ART-${i}`,
      ARTICLE_DESCRIPTION_LONG: `Detailed description for ${description} - Style ${i}`,
      HSN_CODE: `HSN${String(i).padStart(4, '0')}`,
      VND_CD: `VND${String(i).padStart(3, '0')}`,
      VND_NM: `Vendor ${i}`,
      VND_DZN_NO: `DZN-${i}`,
      MRP: Math.floor(Math.random() * 5000) + 500,
      NOA: Math.floor(Math.random() * 100) + 10,
      RNG_SEG: `RNG-${i}`,
      MAIN_MVGR: `MVGR-${i}`,
      MACRO_MVGR: `MACRO-${i}`,
      YARN: `Yarn-${i}`,
      FAB_WEAVE: `Weave-${i}`,
      FAB2: `Fabric-${i}`,
      FAB_WEAVE_2: `Weave2-${i}`,
      FAB_STYLE: `Style-${i}`,
      FAB_SUB_STYLE: `SubStyle-${i}`,
      SHADE: `Shade-${i}`,
      LYCRA: `Lycra-${i}`,
      GSM: Math.floor(Math.random() * 300) + 100,
      COUNT: Math.floor(Math.random() * 50) + 10,
      OUNZ: Math.floor(Math.random() * 20) + 5,
      FAB_WEIGHT: Math.floor(Math.random() * 500) + 100,
      COLLAR: `Collar-${i}`,
      NECK_BAND_STYLE: `Neck-${i}`,
      COLLAR_SIZE: `Size-${i}`,
      PLACKET_CHANGING: `Placket-${i}`,
      BLT_MAIN_STYLE: `Belt-${i}`,
      SUB_STYLE_BLT: `SubBelt-${i}`,
      BLT_SIZE: `BeltSize-${i}`,
      SLEEVES_MAIN_STYLE: `Sleeve-${i}`,
      BTFOLD: `Fold-${i}`,
      SET: `Set-${i}`,
      NECK_BAND: `Band-${i}`,
      FO_BTN_STYLE: `Button-${i}`,
      POCKET: `Pocket-${i}`,
      FIT: `Fit-${i}`,
      PATTERN: `Pattern-${i}`,
      LENGTH: `Length-${i}`,
      MAIN_STYLE: `MainStyle-${i}`,
      DC_SUB_STYLE: `DCSub-${i}`,
      DC_EDGE_LOOP: `Edge-${i}`,
      BTN_MAIN_MVGR: `BtnMVGR-${i}`,
      SUB_STYLE_BTN_CLR: `BtnColor-${i}`,
      ZIP: `Zip-${i}`,
      ZIP_COL: `ZipColor-${i}`,
      ADD_ACC: `Acc-${i}`,
      ACC_COL: `AccColor-${i}`,
      PRINT_TYPE: `Print-${i}`,
      PRINT_PLACEMENT: `Placement-${i}`,
      PRINT_STYLE: `PrintStyle-${i}`,
      PATCHES: `Patch-${i}`,
      PATCH_TYPE: `PatchType-${i}`,
      EMBROIDERY: `Emb-${i}`,
      EMB_TYPE: `EmbType-${i}`,
      PLACEMENT: `Place-${i}`,
      ADD_ACC1: `Acc1-${i}`,
      WASH: `Wash-${i}`,
      WASH_COLOR: `WashColor-${i}`,
      BUYING_TYPE: `Buy-${i}`,
      PD: `PD-${i}`,
      BRAND_VENDOR: `Brand-${i}`,
      MDM_REMARKS: `Remarks-${i}`,
      DATE: '2024-01-15',
      COLOR1: `Color-${i}`,
      SIZE: `Size-${i}`,
      SEASON: `Season-${i}`,
      SOURCE: `Source-${i}`,
      FILE_PATH: `/files/article-${i}.jpg`
    });
  }
  return data;
};

const mainTableColumns = [
  "MC CODE",
  "SEGMENT", 
  "DIVISION",
  "MAJOR CATEGORY",
  "ARTICLE DESCRIPTION",
  "STATUS",
  "IMAGES"
];

const statusBadge = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.includes("pending")) return <span className="modern-status-badge modern-status-pending"><FaClock /> Pending</span>;
  if (s.includes("approved")) return <span className="modern-status-badge modern-status-approved"><FaCheck /> Approved</span>;
  if (s.includes("reject")) return <span className="modern-status-badge modern-status-rejected"><FaTimes /> Rejected</span>;
  return <span className="modern-status-badge modern-status-pending"><FaClock /> {status}</span>;
};

const Rejections = ({ onSidebarToggle }) => {
  const [selectedRejection, setSelectedRejection] = useState(null);
  const [editRejection, setEditRejection] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(false);
  const [articleRows, setArticleRows] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchFocused, setSearchFocused] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(null);
  const [expandedReasons, setExpandedReasons] = useState(new Set());
  const [rejectionReason, setRejectionReason] = useState('');
  const [sectionVisibility, setSectionVisibility] = useState({
    basic: true,
    garment: false,
    hardware: false,
    final: false,
    status: false,
    images: false
  });

  const toggleSection = (section) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
  };

  const loadStaticData = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const staticData = generateRejectedData();
      setArticleRows(staticData);
      setLoading(false);
    }, 500);
  };

  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(paginatedData.map(row => row.ArticleId));
      setSelectedItems(allIds);
      setSelectAll(true);
    }
  };

  const handleSelectItem = (articleId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(articleId)) {
      newSelectedItems.delete(articleId);
    } else {
      newSelectedItems.add(articleId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleBulkApprove = () => {
    if (selectedItems.size === 0) {
      showToast('Please select items to approve', 'error');
      return;
    }
    
    showToast(`Approving ${selectedItems.size} items...`, 'info');
    setTimeout(() => {
      showToast(`Successfully approved ${selectedItems.size} items!`, 'success');
      setSelectedItems(new Set());
    }, 1500);
  };

  const handleBulkReject = () => {
    if (selectedItems.size === 0) {
      showToast('Please select items to reject', 'error');
      return;
    }
    
    showToast(`Rejecting ${selectedItems.size} items...`, 'info');
    setTimeout(() => {
      showToast(`Successfully rejected ${selectedItems.size} items!`, 'success');
      setSelectedItems(new Set());
    }, 1500);
  };

  const handleViewDetails = (rejection) => {
    setSelectedRejection(rejection);
    showToast(`📋 Viewing details for ${rejection.ArticleId}`, 'info');
  };

  const handleShowReason = (rejection) => {
    setShowReasonModal(rejection);
  };

  const handleEdit = (rejection) => {
    setEditRejection(rejection);
    setRejectionReason(rejection.REJECTION_REASON || '');
    showToast(`✏️ Editing article ${rejection.ArticleId}`, 'info');
  };

  const handleEditApprove = async () => {
    if (!editRejection) return;
    
    setActionLoading(`edit-approve-${editRejection.ArticleId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setArticleRows(prevRows => 
        prevRows.map(row => 
          row.ArticleId === editRejection.ArticleId 
            ? { ...row, STATUS: 'Approved', REJECTION_REASON: '' }
            : row
        )
      );
      
      showToast(`Article ${editRejection.ArticleId} approved successfully!`, 'success');
      setEditRejection(null);
      setRejectionReason('');
    } catch (error) {
      showToast(`Failed to approve article ${editRejection.ArticleId}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditReject = async () => {
    if (!editRejection) return;
    
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    
    setActionLoading(`edit-reject-${editRejection.ArticleId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setArticleRows(prevRows => 
        prevRows.map(row => 
          row.ArticleId === editRejection.ArticleId 
            ? { ...row, STATUS: 'Rejected', REJECTION_REASON: rejectionReason }
            : row
        )
      );
      
      showToast(`Article ${editRejection.ArticleId} rejection reason updated!`, 'success');
      setEditRejection(null);
      setRejectionReason('');
    } catch (error) {
      showToast(`Failed to update article ${editRejection.ArticleId}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleReasonExpansion = (articleId) => {
    setExpandedReasons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
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
    
    if (filterStatus === 'high') {
      filtered = filtered.filter(row => row.priority === 'high');
    } else if (filterStatus === 'medium') {
      filtered = filtered.filter(row => row.priority === 'medium');
    } else if (filterStatus === 'low') {
      filtered = filtered.filter(row => row.priority === 'low');
    }
    
    // Sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        
        if (sortOrder === 'asc') {
          return aVal.toString().localeCompare(bVal.toString());
        } else {
          return bVal.toString().localeCompare(aVal.toString());
        }
      });
    }
    
    setDisplayedArticles(filtered);
  }, [articleRows, searchQuery, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    loadStaticData();
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
          Loading rejected articles...
        </div>
      )}

      <TopBar onSidebarToggle={onSidebarToggle} currentPage="rejections" />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-content">
            <span>{toastMessage}</span>
            <button 
              className="toast-close" 
              onClick={() => setToastMessage('')}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="modern-card">
        {/* Modern Header */}
        {/* <div className="modern-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <h1 className="modern-title" style={{ color: '#ffffff' }}>
              <FiPackage style={{ fontSize: '2.2rem', color: '#1e3a8a' }} />
              Rejected Articles Management
            </h1>
          </div>
        </div> */}

        {/* Modern Toolbar */}
        <div className="modern-toolbar">
          {/* Enhanced Search Bar */}
          <div className={`modern-search ${searchFocused ? 'focused' : ''}`}>
            <FaSearch className="modern-search-icon" />
            <input
              type="text"
              placeholder="Search by MC Code, Description, Category, Segment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
        
          <div className="toolbar-actions">
            <select
              className="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <FiTable />
              </button>
              <button 
                className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
              >
                <FiGrid />
              </button>
            </div>

            {selectedItems.size > 0 ? (
              // Show bulk action buttons when items are selected
              <>
                <button
                  className="modern-action-btn modern-action-btn-edit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Bulk Edit clicked');
                    // Handle bulk edit - open edit modal for first selected item
                    const firstSelectedItem = paginatedData.find(item => selectedItems.has(item.ArticleId));
                    if (firstSelectedItem) {
                      handleEdit(firstSelectedItem);
                    }
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="modern-action-btn modern-action-btn-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} selected articles?`)) {
                      // Handle bulk delete
                      const updatedData = articleRows.filter(item => !selectedItems.has(item.ArticleId));
                      setArticleRows(updatedData);
                      setDisplayedArticles(updatedData.filter(p => 
                        searchQuery === '' || 
                        p.MC_CODE.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.ARTICLE_DESCRIPTION.toLowerCase().includes(searchQuery.toLowerCase())
                      ));
                      setSelectedItems(new Set());
                      setSelectAll(false);
                      showToast(`${selectedItems.size} items deleted successfully!`, 'success');
                    }
                  }}
                >
                  <FaTrash />
                </button>
                <button
                  className="modern-btn modern-btn-outline"
                  onClick={() => {
                    setSelectedItems(new Set());
                    setSelectAll(false);
                    showToast('Selection cleared');
                  }}
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              // Show refresh button when no items are selected
              <button className="refresh-btn" onClick={loadStaticData}>
                <FaSync />
              </button>
            )}
          </div>
        </div>

        {/* Modern Table */}
        <div className="modern-table-container">
          {viewMode === 'table' ? (
            <div className="modern-table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
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
                      <td colSpan={mainTableColumns.length + 3}>
                        No rejected articles found.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => {
                      return (
                        <tr key={idx + (currentPage - 1) * rowsPerPage}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedItems.has(row.ArticleId)}
                              onChange={() => handleSelectItem(row.ArticleId)}
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
                                      <div className="status-with-reason">
                                        <StatusBadge status={row[actualField]} />
                                        {row.REJECTION_REASON && (
                                          <button
                                            className="reason-icon-btn"
                                            onClick={() => handleShowReason(row)}
                                            title="View rejection reason"
                                          >
                                            <FaExclamationTriangle className="reason-warning-icon" />
                                          </button>
                                        )}
                                      </div>
                                    )
                                  : header === "IMAGES"
                                    ? (() => {
                                        const imagesArr = Array.isArray(row.Images) ? row.Images : [];
                                        
                                        if (!imagesArr || imagesArr.length === 0) {
                                          return (
                                            <div className="modern-image-placeholder">
                                              <img 
                                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+"
                                                alt="No Image"
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
                                            {imagesArr.slice(0, 2).map((imageUrl, idx) => (
                                              <img
                                                key={idx}
                                                src={imageUrl}
                                                alt={`Article Image ${idx + 1}`}
                                                style={{
                                                  width: '32px',
                                                  height: '32px',
                                                  objectFit: 'cover',
                                                  borderRadius: '6px'
                                                }}
                                                onError={e => { 
                                                  e.target.onerror = null; 
                                                  handleImageError(imageUrl, e.target);
                                                }}
                                              />
                                            ))}
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
                          <td className="actions-cell">
                            <div className="action-buttons">
                              {selectedItems.size > 0 ? (
                                // Show disabled action buttons when items are selected
                                <>
                              <button
                                className="modern-action-btn modern-action-btn-view"
                                    disabled={true}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="modern-action-btn modern-action-btn-edit"
                                    disabled={true}
                              >
                                <FaEdit />
                              </button>
                                </>
                              ) : (
                                // Show individual action buttons when no items are selected
                                <>
                        <button
                          className="modern-action-btn modern-action-btn-view"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('View button clicked');
                                      handleViewDetails(row);
                                    }}
                                  >
                                    <FaEye />
                        </button>
                        <button
                          className="modern-action-btn modern-action-btn-edit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('Edit button clicked');
                                      handleEdit(row);
                                    }}
                                  >
                                    <FaEdit />
                        </button>
                                </>
                              )}
                      </div>
                          </td>
                        </tr>
                  );
                })
              )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View */
            <GridView
              data={paginatedData}
              onView={handleViewDetails}
              onEdit={handleEdit}
              handleImageError={handleImageError}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              disabled={selectedItems.size > 0}
            />
          )}
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

      {/* Edit Modal */}
      <EditModal
        isOpen={editRejection !== null}
        onClose={() => setEditRejection(null)}
        editItem={editRejection}
        selectedRejectionReason={rejectionReason}
        setSelectedRejectionReason={setRejectionReason}
        customRejectionReason=""
        setCustomRejectionReason={() => {}}
        handleEditApprove={handleEditApprove}
        handleEditReject={handleEditReject}
        actionLoading={actionLoading}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={selectedRejection !== null}
        onClose={() => setSelectedRejection(null)}
        selectedItem={selectedRejection}
        sectionVisibility={sectionVisibility}
        toggleSection={toggleSection}
        statusBadge={StatusBadge}
        handleImageError={handleImageError}
      />

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="modal-overlay" onClick={() => setShowReasonModal(null)}>
          <div className="modal-content enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header sticky-header">
              <h2>
                <FaExclamationTriangle className="modal-icon warning" />
                Rejection Details - {showReasonModal.ArticleId}
              </h2>
              <button className="modal-close" onClick={() => setShowReasonModal(null)}>×</button>
            </div>
            <div className="modal-body scrollable-body">
              {/* Basic Information Section */}
              <div className="modal-section">
                <h3><FiPackage className="section-icon" />Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>MC Code:</label>
                    <span>{showReasonModal.MC_CODE}</span>
                  </div>
                  <div className="detail-item">
                    <label>Description:</label>
                    <span>{showReasonModal.ARTICLE_DESCRIPTION}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className="status-rejected">
                      <FaTimesCircle /> Rejected
                  </span>
                </div>
              </div>
                  </div>
              
              {/* Rejection Reason Section */}
                <div className="modal-section">
                <h3><FaExclamationTriangle className="section-icon" />Rejection Reason</h3>
                <div className="rejection-reason-box">
                  <div className="reason-text">
                    {showReasonModal.REJECTION_REASON || 'No rejection reason provided.'}
                  </div>
                </div>
                  </div>
                  </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && (
        <div className={`toast-message ${toastMessage.includes('success') ? 'success' : toastMessage.includes('error') ? 'error' : 'info'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Rejections; 