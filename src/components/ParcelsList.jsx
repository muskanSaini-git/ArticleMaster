import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaDownload, FaPrint, FaShare, FaHourglassHalf, FaTable, FaTh, FaSearch, FaSync, FaCheck, FaClock, FaTimes, FaEdit, FaInfoCircle, FaCut, FaChevronUp, FaChevronDown, FaFilter, FaTrash } from 'react-icons/fa';
import { FiEye, FiTable, FiGrid, FiPackage } from "react-icons/fi";
import TopBar from './TopBar';
import GridView from './GridView';
import './ParcelsList.css';
import './UnifiedModal.css';

// Generate static sample data for all parcels
const generateParcelsData = () => {
  
  const data = [];
  const segments = ['SEG-A', 'SEG-B', 'SEG-C', 'SEG-D'];
  const divisions = ['DIV-1', 'DIV-2', 'DIV-3', 'DIV-4'];
  const categories = ['Casual Wear', 'Formal Wear', 'Sportswear', 'Outerwear'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  const submitters = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
  const approvers = ['Admin User', 'Manager A', 'Manager B', 'Supervisor X', 'Director Y'];
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
    'Work Uniform',
    'Slim Fit Jeans',
    'Oversized Hoodie',
    'Crop Top Blouse',
    'High-Waist Pants',
    'V-Neck Sweater',
    'Bomber Jacket',
    'Pencil Skirt',
    'Tank Top',
    'Chino Pants',
    'Knit Sweater',
    'Leather Jacket',
    'Maxi Dress',
    'Cargo Shorts',
    'Blazer Jacket',
    'Turtleneck Sweater'
  ];

  // Sample data arrays for all 70 fields
  const fabricDivisions = ['Cotton', 'Polyester', 'Blend', 'Denim'];
  const yarns = ['Cotton 30s', 'Polyester 40s', 'Viscose 32s', 'Bamboo 28s'];
  const weaves = ['Plain', 'Twill', 'Satin', 'Jersey'];
  const compositions = ['100% Cotton', '65% Cotton 35% Polyester', '80% Cotton 20% Polyester', '100% Polyester'];
  const finishes = ['Enzyme Wash', 'Stone Wash', 'Acid Wash', 'Bio Wash'];
  const constructions = ['Single Jersey', 'Rib', 'Interlock', 'Fleece'];
  const neckTypes = ['Round Neck', 'V-Neck', 'Polo Neck', 'Crew Neck'];
  const sleeves = ['Short Sleeve', 'Long Sleeve', '3/4 Sleeve', 'Sleeveless'];
  const fits = ['Regular', 'Slim', 'Loose', 'Oversized'];
  const patterns = ['Solid', 'Striped', 'Checked', 'Printed'];
  const colors = ['White', 'Black', 'Navy', 'Grey', 'Red', 'Blue'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const buyingTypes = ['FOB', 'CIF', 'CNF', 'EXW'];
  const articleTypes = ['Basic', 'Fashion', 'Premium', 'Economy'];

  for (let i = 1; i <= 80; i++) {
    const segment = segments[i % 4];
    const division = divisions[i % 4];
    const category = categories[i % 4];
    const description = descriptions[i % 25];
    const status = statuses[i % 3];
    const submitter = submitters[i % 5];
    const approver = status === 'Approved' ? approvers[i % 5] : (status === 'Rejected' ? approvers[i % 5] : '');

    // Generate random dates within the last 6 months
    const submitDate = new Date();
    submitDate.setDate(submitDate.getDate() - Math.floor(Math.random() * 180));

    data.push({
      ArticleId: i,
      // Basic Information (1-10)
      FG_SEG: segment,
      FG_DIV: division,
      SUB_DIV: `SUB-${division}-${i % 10}`,
      MJ_CAT: `MJ${String(i % 20).padStart(2, '0')}`,
      MAJ_CAT_FULL_FORM: category,
      MC_CD: `MC${String(i).padStart(3, '0')}`,
      MC_DESC: `${description} - MC${String(i).padStart(3, '0')}`,
      MC_DESC_FULL_FORM: `Full Description for ${description} - Style ${i}`,
      MACRO_MVGR: `MACRO-${i % 5}`,
      MICRO_MVGR: `MICRO-${i % 8}`,
      
      // Fabric Details (11-26)
      FAB_DIV: fabricDivisions[i % 4],
      YARN_01: yarns[i % 4],
      YARN_02: yarns[(i + 1) % 4],
      MAIN_MVGR: `MAIN-${i % 6}`,
      WEAVE: weaves[i % 4],
      WEAVE_2: weaves[(i + 2) % 4],
      COMPOSITION: compositions[i % 4],
      FINISH: finishes[i % 4],
      CONSTRUCTION: constructions[i % 4],
      GSM: Math.floor(Math.random() * 200) + 120,
      WIDTH: Math.floor(Math.random() * 20) + 40,
      WIDTH_UOM: 'Inches',
      COUNT: `${Math.floor(Math.random() * 20) + 20}s`,
      WEIGHT_TYPE: ['Light', 'Medium', 'Heavy'][i % 3],
      ORIGINAL_MATERIAL_SOURCE: ['India', 'China', 'Bangladesh', 'Vietnam'][i % 4],
      SHADE: colors[i % 6],
      
      // LCR and Garment Details (27-47)
      LCR_NON_LCR: ['LCR', 'NON-LCR'][i % 2],
      NECK: neckTypes[i % 4],
      NECK_TYPE: neckTypes[i % 4],
      NECK_SIZE: `${Math.floor(Math.random() * 5) + 15}cm`,
      PLACKET: ['Button', 'Zip', 'None'][i % 3],
      FATHER_BELT: ['Yes', 'No'][i % 2],
      BELT_DESIGN: ['Plain', 'Contrast', 'Logo'][i % 3],
      BLT_SIZE: `${Math.floor(Math.random() * 10) + 30}mm`,
      SLEEVE: sleeves[i % 4],
      BTM_FOLD: ['Yes', 'No'][i % 2],
      BOTTOM_OPEN_WIDTH_INC: Math.floor(Math.random() * 10) + 20,
      SET: ['Single', 'Double', 'Triple'][i % 3],
      FO_STYLE: ['Regular', 'Fashion', 'Premium'][i % 3],
      POCKET_TYPE: ['Side', 'Chest', 'Back', 'None'][i % 4],
      NO_OF_POCKET: Math.floor(Math.random() * 4) + 1,
      FIT: fits[i % 4],
      PATTERN: patterns[i % 4],
      LENGTH: ['Short', 'Regular', 'Long'][i % 3],
      MEASUREMENT_LENGTH_INCH: Math.floor(Math.random() * 10) + 25,
      DRAWCORD: ['Yes', 'No'][i % 2],
      DRAWCORD_STYLE: ['Regular', 'Fashion', 'Premium'][i % 3],
      
      // Hardware & Trims (48-67)
      DRAWCORD_LOOP: ['Yes', 'No'][i % 2],
      BUTTON: ['Plastic', 'Metal', 'Wood', 'None'][i % 4],
      BUTTON_COLOR: colors[i % 6],
      ZIP: ['Yes', 'No'][i % 2],
      ZIP_COL: colors[i % 6],
      PRINT_TYPE: ['Screen', 'Digital', 'Transfer', 'None'][i % 4],
      PRINT_PLACEMENT: ['Front', 'Back', 'Side', 'All Over'][i % 4],
      PRINT_STYLE: ['Regular', 'Fashion', 'Premium'][i % 3],
      PATCHES: ['Yes', 'No'][i % 2],
      PATCH_TYPE: ['Embroidered', 'Printed', 'Woven', 'None'][i % 4],
      EMBROIDERY: ['Yes', 'No'][i % 2],
      EMB_TYPE: ['Regular', 'Fashion', 'Premium'][i % 3],
      PLACEMENT: ['Front', 'Back', 'Side', 'All Over'][i % 4],
      ADD_ACC1: ['Hanger', 'Tag', 'Label', 'None'][i % 4],
      
      // Final Details & Pricing (68-80)
      WASH: ['Regular', 'Stone', 'Enzyme', 'None'][i % 4],
      WASH_COLOR: colors[i % 6],
      CLR: colors[i % 6],
      SIZE: sizes[i % 6],
      MRP: Math.floor(Math.random() * 5000) + 500,
      SEG: segment,
      ARTICLE_TYPE: articleTypes[i % 4],
      BUYING_TYPE: buyingTypes[i % 4],
      PD: `PD-${String(i).padStart(3, '0')}`,
      
      // Additional fields for better details
      STATUS: status,
      SUBMIT_DATE: submitDate.toLocaleDateString(),
      SUBMIT_BY: submitter,
      APPROVED_BY: approver,
      SEG: segment,
      DIV: division,
      MAJ_CAT_NM: category,
      MC_CODE: `MC${String(i).padStart(3, '0')}`,
      ARTICLE_DESCRIPTION: `${description} - Style ${i}`,
      priority: ['high', 'medium', 'low'][i % 3],
      Images: [
        `https://picsum.photos/100/100?random=${i + 300}`,
        `https://picsum.photos/100/100?random=${i + 301}`,
        `https://picsum.photos/100/100?random=${i + 302}`,
        `https://picsum.photos/100/100?random=${i + 303}`,
        `https://picsum.photos/100/100?random=${i + 304}`
      ],
      HSN_CODE: `HSN${String(i).padStart(4, '0')}`,
      VND_CD: `VND${String(i).padStart(3, '0')}`,
      VND_NM: `Vendor ${i}`,
      VND_DZN_NO: `DZN-${i}`,
      NOA: Math.floor(Math.random() * 100) + 10,
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
  "SUBMIT DATE",
  "SUBMIT BY",
  "APPROVED BY",
  "IMAGES",
  "ACTIONS"
];

const sectionBoxStyle = {
  padding: '10px',
  background: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
};

const statusBadge = (status) => {
  const statusClass = status.toLowerCase();
  const statusColor = status === 'Pending' ? '#f59e0b' : 
                     status === 'Approved' ? '#10b981' : 
                     status === 'Rejected' ? '#ef4444' : '#6b7280';
  
  return (
    <span style={{ 
      color: statusColor, 
      fontWeight: '600', 
      fontSize: '0.8rem',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      {status === 'Pending' && <FaHourglassHalf />}
      {status === 'Approved' && <FaCheckCircle />}
      {status === 'Rejected' && <FaTimesCircle />}
      <span>{status}</span>
    </span>
  );
};

const ParcelsList = ({ onSidebarToggle }) => {
  // Modal section visibility state
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

  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editParcel, setEditParcel] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [statusFilterDropdown, setStatusFilterDropdown] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState('');
  const [showSegmentFilter, setShowSegmentFilter] = useState(false);
  const [divisionFilter, setDivisionFilter] = useState('');
  const [showDivisionFilter, setShowDivisionFilter] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Increased from 10 to 20 for better scroll experience

  // Pagination calculations
  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredParcels.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter, segmentFilter, divisionFilter, searchTerm]);

  const handleImageError = (imageUrl, element) => {
    console.warn(`Failed to load image: ${imageUrl}`);
    if (element && element.target) {
      element.target.style.display = 'none';
      const parent = element.target.parentElement;
      if (parent) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = '<span>No Image</span>';
        parent.appendChild(placeholder);
      }
    }
  };

  const loadStaticData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateParcelsData();
      setParcels(data);
      setFilteredParcels(data);
      setLoading(false);
    }, 1000);
  };

  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleViewDetails = (parcel) => {
    console.log('View button clicked for parcel:', parcel.MC_CODE);
    // Close edit modal if open
    setEditModalOpen(false);
    setEditParcel(null);
    // Open view modal
    setSelectedParcel(parcel);
    setViewModalOpen(true);
  };

  const handleEdit = (parcel) => {
    console.log('Edit button clicked for parcel:', parcel.MC_CODE);
    // Close view modal if open
    setViewModalOpen(false);
    setSelectedParcel(null);
    // Open edit modal
    setEditParcel(parcel);
    setEditModalOpen(true);
  };

  const handleEditApprove = () => {
    if (!editParcel) return;
    
    setActionLoading(`edit-approve-${editParcel.ArticleId}`);
    
    setTimeout(() => {
      const updatedParcels = parcels.map(p => 
        p.ArticleId === editParcel.ArticleId 
          ? { ...p, STATUS: 'Approved', APPROVED_BY: 'Current User' }
          : p
      );
      setParcels(updatedParcels);
      setFilteredParcels(updatedParcels.filter(p => 
        statusFilter === 'all' || p.STATUS.toLowerCase() === statusFilter
      ));
      setActionLoading(null);
      setEditModalOpen(false);
      showToast(`Article ${editParcel.MC_CODE} has been approved successfully!`, 'success');
    }, 1500);
  };

  const handleEditReject = () => {
    if (!editParcel) return;
    
    if (!selectedRejectionReason) {
      showToast('Please select a rejection reason before rejecting the article.', 'error');
      return;
    }
    
    if (selectedRejectionReason === 'Other' && !customRejectionReason.trim()) {
      showToast('Please provide a custom rejection reason.', 'error');
      return;
    }
    
    setActionLoading(`edit-reject-${editParcel.ArticleId}`);
    
    setTimeout(() => {
      const finalReason = selectedRejectionReason === 'Other' 
        ? customRejectionReason 
        : selectedRejectionReason;
      
      const updatedParcels = parcels.map(p => 
        p.ArticleId === editParcel.ArticleId 
          ? { 
              ...p, 
              STATUS: 'Rejected', 
              APPROVED_BY: 'Current User',
              rejectionReason: finalReason 
            }
          : p
      );
      setParcels(updatedParcels);
      setFilteredParcels(updatedParcels.filter(p => 
        statusFilter === 'all' || p.STATUS.toLowerCase() === statusFilter
      ));
      setActionLoading(null);
      setEditModalOpen(false);
      showToast(`Article ${editParcel.MC_CODE} has been rejected. Reason: ${finalReason}`, 'error');
    }, 1500);
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedParcels.length === paginatedData.length) {
      setSelectedParcels([]);
    } else {
      setSelectedParcels(paginatedData.map(p => p.ArticleId));
    }
  };

  const handleSelectItem = (parcelId) => {
    setSelectedParcels(prev => 
      prev.includes(parcelId) 
        ? prev.filter(id => id !== parcelId)
        : [...prev, parcelId]
    );
  };

  useEffect(() => {
    loadStaticData();
  }, []);

  // Test React Icons
  useEffect(() => {
    console.log('Testing React Icons:');
    console.log('FaEye:', FaEye);
    console.log('FaEdit:', FaEdit);
    console.log('FaTimes:', FaTimes);
    
    // Test if icons are functions
    if (typeof FaEye === 'function') {
      console.log('FaEye is a function - should work');
    } else {
      console.log('FaEye is not a function - may be undefined');
    }
  }, []);

  useEffect(() => {
    let filtered = parcels;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(parcel =>
        parcel.MC_CODE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.ARTICLE_DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.SEG.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.DIV.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.MAJ_CAT_NM.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.SUBMIT_BY.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.APPROVED_BY.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => 
        parcel.STATUS.toLowerCase() === statusFilter
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(parcel => 
        parcel.SUBMIT_DATE.includes(dateFilter)
      );
    }
    
    // Apply segment filter
    if (segmentFilter) {
      filtered = filtered.filter(parcel => 
        parcel.SEG.toLowerCase().includes(segmentFilter.toLowerCase())
      );
    }
    
    // Apply division filter
    if (divisionFilter) {
      filtered = filtered.filter(parcel => 
        parcel.DIV.toLowerCase().includes(divisionFilter.toLowerCase())
      );
    }
    
    setFilteredParcels(filtered);
  }, [searchTerm, parcels, statusFilter, dateFilter, segmentFilter, divisionFilter]);

  // Handle clicking outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((showDateFilter || showSegmentFilter || showDivisionFilter || statusFilterDropdown) && 
          !event.target.closest('.filter-dropdown')) {
        setShowDateFilter(false);
        setShowSegmentFilter(false);
        setShowDivisionFilter(false);
        setStatusFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateFilter, showSegmentFilter, showDivisionFilter, statusFilterDropdown]);

  if (loading) {
    return (
      <div className="article-parcel-container">
        <div className="modern-card">
          <div className="loading-container" style={{textAlign: 'center', padding: '60px 0'}}>
            <FaSync className="spinning" style={{fontSize: '2rem', color: '#667eea'}} />
            <div style={{marginTop: 16, color: '#334155', fontWeight: 500}}>Loading parcels...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-parcel-container">
      <TopBar onSidebarToggle={onSidebarToggle} />
      
      {toastMessage && (
        <div className={`toast-notification ${toastType}`}>
          {toastMessage}
        </div>
      )}

      <div className="modern-card">
        <div className="modern-toolbar">
          <div className="modern-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search parcels by code, description, segment, division, submitter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <select 
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <FiTable />
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
            </div>

            {selectedParcels.length > 0 ? (
              // Show bulk action buttons when items are selected
              <>
                <button
                  className="modern-action-btn modern-action-btn-edit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Bulk Edit clicked');
                    // Handle bulk edit - open edit modal for first selected item
                    const firstSelectedParcel = paginatedData.find(p => p.ArticleId === selectedParcels[0]);
                    if (firstSelectedParcel) {
                      handleEdit(firstSelectedParcel);
                    }
                  }}
                  title="Bulk Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="modern-action-btn modern-action-btn-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Bulk Delete clicked');
                    // Handle bulk delete
                    if (window.confirm(`Are you sure you want to delete ${selectedParcels.length} selected items?`)) {
                      const updatedParcels = parcels.filter(p => !selectedParcels.includes(p.ArticleId));
                      setParcels(updatedParcels);
                      setFilteredParcels(updatedParcels.filter(p => 
                        statusFilter === 'all' || p.STATUS.toLowerCase() === statusFilter
                      ));
                      setSelectedParcels([]);
                      showToast(`${selectedParcels.length} items deleted successfully!`, 'success');
                    }
                  }}
                  title="Bulk Delete"
                >
                  <FaTrash />
                </button>
                <button
                  className="modern-btn modern-btn-outline"
                  onClick={() => setSelectedParcels([])}
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

        <div className="modern-table-container">
          {viewMode === 'table' ? (
          <div className="modern-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                        checked={selectedParcels.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {mainTableColumns.map((column, index) => (
                      <th key={`${column}-${index}`}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <span>{column}</span>
                          {(column === 'SUBMIT DATE' || column === 'SEGMENT' || column === 'DIVISION' || column === 'STATUS') && (
                            <button
                              onClick={() => {
                                if (column === 'SUBMIT DATE') setShowDateFilter(!showDateFilter);
                                if (column === 'SEGMENT') setShowSegmentFilter(!showSegmentFilter);
                                if (column === 'DIVISION') setShowDivisionFilter(!showDivisionFilter);
                                if (column === 'STATUS') setStatusFilterDropdown(!statusFilterDropdown);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                borderRadius: '4px',
                                color: ((column === 'SUBMIT DATE' && dateFilter) || 
                                        (column === 'SEGMENT' && segmentFilter) || 
                                        (column === 'DIVISION' && divisionFilter) || 
                                        (column === 'STATUS' && statusFilter !== 'all')) ? '#667eea' : '#6b7280',
                                fontSize: '12px'
                              }}
                              title={`Filter by ${column.toLowerCase()}`}
                            >
                              <FaFilter />
                            </button>
                          )}
                        </div>
                        
                        {/* Date Filter Dropdown */}
                        {column === 'SUBMIT DATE' && showDateFilter && (
                          <div className="filter-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            marginTop: '4px'
                          }}>
                            <input
                              type="date"
                              value={dateFilter}
                              onChange={(e) => setDateFilter(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                              placeholder="Filter by date"
                            />
                            {dateFilter && (
                              <button
                                onClick={() => setDateFilter('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '10px',
                                  marginTop: '4px'
                                }}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                        
                        {/* Segment Filter Dropdown */}
                        {column === 'SEGMENT' && showSegmentFilter && (
                          <div className="filter-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            marginTop: '4px'
                          }}>
                            <select
                              value={segmentFilter}
                              onChange={(e) => setSegmentFilter(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <option value="">All Segments</option>
                              {Array.from(new Set(paginatedData.map(item => item.SEG))).map((segment, index) => (
                                <option key={`${segment}-${index}`} value={segment}>{segment}</option>
                              ))}
                            </select>
                            {segmentFilter && (
                              <button
                                onClick={() => setSegmentFilter('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '10px',
                                  marginTop: '4px'
                                }}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                        
                        {/* Division Filter Dropdown */}
                        {column === 'DIVISION' && showDivisionFilter && (
                          <div className="filter-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            marginTop: '4px'
                          }}>
                            <select
                              value={divisionFilter}
                              onChange={(e) => setDivisionFilter(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <option value="">All Divisions</option>
                              {Array.from(new Set(paginatedData.map(item => item.DIV))).map((division, index) => (
                                <option key={`${division}-${index}`} value={division}>{division}</option>
                              ))}
                            </select>
                            {divisionFilter && (
                              <button
                                onClick={() => setDivisionFilter('')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '10px',
                                  marginTop: '4px'
                                }}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                        
                        {/* Status Filter Dropdown */}
                        {column === 'STATUS' && statusFilterDropdown && (
                          <div className="filter-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            right: '0',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            marginTop: '4px'
                          }}>
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <option value="all">All Status</option>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            {statusFilter !== 'all' && (
                              <button
                                onClick={() => setStatusFilter('all')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '10px',
                                  marginTop: '4px'
                                }}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        )}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={mainTableColumns.length + 2} style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                          No parcels found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((parcel, index) => {
                      const isSelected = selectedParcels.includes(parcel.ArticleId);
                      const imagesArr = Array.isArray(parcel.Images) ? parcel.Images : [];
                      
                      return (
                        <tr key={parcel.ArticleId} className={isSelected ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                              checked={isSelected}
                        onChange={() => handleSelectItem(parcel.ArticleId)}
                              style={{ width: '16px', height: '16px' }}
                      />
                    </td>
                          <td>{parcel.MC_CODE}</td>
                    <td>{parcel.SEG}</td>
                    <td>{parcel.DIV}</td>
                    <td>{parcel.MAJ_CAT_NM}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {parcel.ARTICLE_DESCRIPTION}
                    </td>
                    <td>{statusBadge(parcel.STATUS)}</td>
                    <td>{parcel.SUBMIT_DATE}</td>
                    <td>{parcel.SUBMIT_BY}</td>
                          <td>{parcel.APPROVED_BY || 'Not yet approved'}</td>
                          <td>
                            <div className="modern-image-grid">
                              {imagesArr.length > 0 ? (
                                <>
                                  {imagesArr.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                                      src={img}
                                      alt={`Parcel ${parcel.MC_CODE} ${idx + 1}`}
                                      className="modern-image-thumbnail"
                                      style={{ width: '24px', height: '24px' }}
                                      onError={(e) => handleImageError(img, e.target)}
                                    />
                                  ))}
                                  {imagesArr.length > 3 && (
                                    <div className="modern-image-more" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                      +{imagesArr.length - 3}
        </div>
                                  )}
                                </>
                              ) : (
                                <div className="modern-image-placeholder" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                  <FiPackage />
      </div>
                              )}
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              {selectedParcels.length > 0 ? (
                                // Show disabled action buttons when items are selected
                                <>
                                  <button className="modern-action-btn modern-action-btn-view" disabled={true}>
                                    <FaEye />
                                  </button>
                                  <button className="modern-action-btn modern-action-btn-edit" disabled={true}>
                                    <FaEdit />
                                  </button>
                                </>
                              ) : (
                                // Show individual action buttons when no items are selected
                                <>
                                  <button className="modern-action-btn modern-action-btn-view" onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log('View button clicked'); handleViewDetails(parcel); }}>
                                    <FaEye />
                                  </button>
                                  <button className="modern-action-btn modern-action-btn-edit" onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log('Edit button clicked'); handleEdit(parcel); }}>
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
            /* Grid View */
            <GridView
              data={paginatedData}
              onView={handleViewDetails}
              onEdit={handleEdit}
              handleImageError={handleImageError}
              selectedItems={new Set(selectedParcels)}
              handleSelectItem={handleSelectItem}
              disabled={selectedParcels.length > 0}
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

      {/* View Details Modal */}
      {viewModalOpen && selectedParcel && (
        <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div
            className="modal-content headerless-modal"
            style={{
              maxWidth: '500px',
              width: '90%',
              maxHeight: '70vh',
              height: 'auto',
              overflowY: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              margin: '40px 16px 40px 16px',
              display: 'block',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9',
              WebkitScrollbar: {
                width: '8px'
              },
              WebkitScrollbarTrack: {
                background: '#f1f5f9',
                borderRadius: '4px'
              },
              WebkitScrollbarThumb: {
                background: '#cbd5e1',
                borderRadius: '4px'
              },
              WebkitScrollbarThumbHover: {
                background: '#94a3b8'
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="floating-close-btn" onClick={() => setViewModalOpen(false)}>
              <FaTimes />
            </button>
            <div className="modal-body headerless-body" style={{ 
              padding: '15px', 
              background: 'transparent', 
              borderRadius: '0', 
              margin: '0',
              minHeight: '500px'
            }}>
              <div className="comprehensive-details-container" style={{ 
                height: '100%'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ 
                    color: '#000000', 
                    fontSize: '1.3rem', 
                    fontWeight: '700',
                    marginBottom: '6px'
                  }}>
                    Product Details
                </h2>
                  <div style={{ 
                    color: '#000000', 
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {selectedParcel.MC_CD}
                </div>
              </div>

                {/* Basic Information Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('basic')}
                >
                  <FaInfoCircle style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Basic Information
                  {sectionVisibility.basic ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                </div>
                {sectionVisibility.basic && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    {[
                      { label: 'MC Code', value: selectedParcel.MC_CODE },
                      { label: 'Segment', value: selectedParcel.SEG },
                      { label: 'Division', value: selectedParcel.DIV },
                      { label: 'Major Category', value: selectedParcel.MAJ_CAT_NM },
                      { label: 'Description', value: selectedParcel.ARTICLE_DESCRIPTION },
                      { label: 'Status', value: statusBadge(selectedParcel.STATUS) },
                      { label: 'Submit Date', value: selectedParcel.SUBMIT_DATE },
                      { label: 'Submit By', value: selectedParcel.SUBMIT_BY },
                      { label: 'Approved By', value: selectedParcel.APPROVED_BY || 'Not yet approved' }
                    ].map((item, index) => (
                      <div key={`${item.label}-${index}`} style={{
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '10px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '5px', fontSize: '0.9rem' }}>
                          {item.label}
                  </div>
                        <div style={{ color: '#1f2937', fontWeight: '500' }}>
                          {item.value}
                  </div>
                  </div>
                    ))}
                  </div>
                )}

                {/* Garment Construction Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('garment')}
                >
                  <FaEdit style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Garment Construction
                  {sectionVisibility.garment ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                  </div>
                {sectionVisibility.garment && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.1)'
                  }}>
                    {[
                      { label: 'LCR/NON LCR', value: selectedParcel.LCR_NON_LCR },
                      { label: 'NECK', value: selectedParcel.NECK },
                      { label: 'NECK TYPE', value: selectedParcel.NECK_TYPE },
                      { label: 'NECK SIZE', value: selectedParcel.NECK_SIZE },
                      { label: 'PLACKET', value: selectedParcel.PLACKET },
                      { label: 'FATHER BELT', value: selectedParcel.FATHER_BELT },
                      { label: 'BELT DESIGN', value: selectedParcel.BELT_DESIGN },
                      { label: 'BLT SIZE', value: selectedParcel.BLT_SIZE },
                      { label: 'SLEEVE', value: selectedParcel.SLEEVE },
                      { label: 'BTM FOLD', value: selectedParcel.BTM_FOLD },
                      { label: 'BOTTOM OPEN WIDTH (INC)', value: selectedParcel.BOTTOM_OPEN_WIDTH_INC },
                      { label: 'SET', value: selectedParcel.SET },
                      { label: 'FO STYLE', value: selectedParcel.FO_STYLE },
                      { label: 'POCKET TYPE', value: selectedParcel.POCKET_TYPE },
                      { label: 'NO OF POCKET', value: selectedParcel.NO_OF_POCKET },
                      { label: 'FIT', value: selectedParcel.FIT },
                      { label: 'PATTERN', value: selectedParcel.PATTERN },
                      { label: 'LENGTH', value: selectedParcel.LENGTH },
                      { label: 'MEASUREMENT LENGTH (INCH)', value: selectedParcel.MEASUREMENT_LENGTH_INCH },
                      { label: 'DRAWCORD', value: selectedParcel.DRAWCORD },
                      { label: 'DRAWCORD STYLE', value: selectedParcel.DRAWCORD_STYLE }
                    ].map((item, index) => (
                      <div key={`${item.label}-${index}`} style={{
                        padding: '15px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '5px', fontSize: '0.9rem' }}>
                          {item.label}
                  </div>
                        <div style={{ color: '#1f2937', fontWeight: '500' }}>
                          {item.value}
                  </div>
                  </div>
                    ))}
                  </div>
                )}

                {/* Hardware & Trims Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('hardware')}
                >
                  <FaTh style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Hardware & Trims
                  {sectionVisibility.hardware ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                  </div>
                {sectionVisibility.hardware && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.1)'
                  }}>
                    {[
                      { label: 'DRAWCORD LOOP', value: selectedParcel.DRAWCORD_LOOP },
                      { label: 'BUTTON', value: selectedParcel.BUTTON },
                      { label: 'BUTTON COLOR', value: selectedParcel.BUTTON_COLOR },
                      { label: 'ZIP', value: selectedParcel.ZIP },
                      { label: 'ZIP COL', value: selectedParcel.ZIP_COL },
                      { label: 'PRINT TYPE', value: selectedParcel.PRINT_TYPE },
                      { label: 'PRINT PLACEMENT', value: selectedParcel.PRINT_PLACEMENT },
                      { label: 'PRINT STYLE', value: selectedParcel.PRINT_STYLE },
                      { label: 'PATCHES', value: selectedParcel.PATCHES },
                      { label: 'PATCH TYPE', value: selectedParcel.PATCH_TYPE },
                      { label: 'EMBROIDERY', value: selectedParcel.EMBROIDERY },
                      { label: 'EMB TYPE', value: selectedParcel.EMB_TYPE },
                      { label: 'PLACEMENT', value: selectedParcel.PLACEMENT },
                      { label: 'ADD ACC1', value: selectedParcel.ADD_ACC1 }
                    ].map((item, index) => (
                      <div key={`${item.label}-${index}`} style={{
                        padding: '15px',
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(245, 158, 11, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '5px', fontSize: '0.9rem' }}>
                          {item.label}
                  </div>
                        <div style={{ color: '#1f2937', fontWeight: '500' }}>
                          {item.value}
                  </div>
                  </div>
                    ))}
                  </div>
                )}

                {/* Final Details Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('final')}
                >
                  <FaCheckCircle style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Final Details & Pricing
                  {sectionVisibility.final ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                  </div>
                {sectionVisibility.final && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                  }}>
                    {[
                      { label: 'WASH', value: selectedParcel.WASH },
                      { label: 'WASH COLOR', value: selectedParcel.WASH_COLOR },
                      { label: 'CLR', value: selectedParcel.CLR },
                      { label: 'SIZE', value: selectedParcel.SIZE },
                      { label: 'MRP', value: `₹${selectedParcel.MRP}` },
                      { label: 'SEG', value: selectedParcel.SEG },
                      { label: 'ARTICLE TYPE', value: selectedParcel.ARTICLE_TYPE },
                      { label: 'BUYING TYPE', value: selectedParcel.BUYING_TYPE },
                      { label: 'PD', value: selectedParcel.PD }
                    ].map((item, index) => (
                      <div key={`${item.label}-${index}`} style={{
                        padding: '15px',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '5px', fontSize: '0.9rem' }}>
                          {item.label}
                  </div>
                        <div style={{ color: '#1f2937', fontWeight: '500' }}>
                          {item.value}
                  </div>
                  </div>
                    ))}
                  </div>
                )}

                {/* Status & Submission Info Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('status')}
                >
                  <FaClock style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Status & Submission
                  {sectionVisibility.status ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                  </div>
                {sectionVisibility.status && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    {[
                      { label: 'Status', value: statusBadge(selectedParcel.STATUS) },
                      { label: 'Submit Date', value: selectedParcel.SUBMIT_DATE },
                      { label: 'Submitted By', value: selectedParcel.SUBMIT_BY },
                      { label: 'Approved By', value: selectedParcel.APPROVED_BY || 'Not yet approved' }
                    ].map((item, index) => (
                      <div key={`${item.label}-${index}`} style={{
                        padding: '15px',
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        borderRadius: '10px',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ fontWeight: '600', color: '#374151', marginBottom: '5px', fontSize: '0.9rem' }}>
                          {item.label}
                  </div>
                        <div style={{ color: '#1f2937', fontWeight: '500' }}>
                          {item.value}
                  </div>
                  </div>
                    ))}
                  </div>
                )}

                {/* Images Section */}
                <div
                  className="section-title"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    color: '#000000',
                    padding: '15px 20px',
                    background: 'rgba(249, 250, 251, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleSection('images')}
                >
                  <FiEye style={{marginRight: 12, color: '#000000', fontSize: '1.1rem'}} /> 
                  Product Images
                  {sectionVisibility.images ? 
                    <FaChevronUp style={{marginLeft: 'auto', color: '#000000'}} /> :
                    <FaChevronDown style={{marginLeft: 'auto', color: '#000000'}} />
                  }
                  </div>
                {sectionVisibility.images && (
                  <div style={{
                    padding: '25px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    marginBottom: '30px'
                  }}>
                    <div className="modal-image-gallery" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px'
                    }}>
                      {selectedParcel.Images.map((img, idx) => (
                        <div key={`img-${idx}-${img.substring(0, 20)}`} style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '12px',
                          padding: '10px',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease'
                        }}>
                          <img
                            src={img}
                            alt={`${selectedParcel.MC_CODE} ${idx + 1}`}
                            style={{
                              width: '100%',
                              height: '180px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '2px solid rgba(0, 0, 0, 0.1)'
                            }}
                            onError={(e) => handleImageError(img, e)}
                          />
                  </div>
                      ))}
                  </div>
                  </div>
                )}

                {/* Additional content to ensure scrolling */}
                <div style={{ 
                  padding: '20px', 
                  background: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ color: '#000000', marginBottom: '15px', fontSize: '1.1rem' }}>
                    Additional Information
                  </h3>
                  <p style={{ color: '#000000', lineHeight: '1.6' }}>
                    This section contains additional product details and specifications that may be relevant for the approval process.
                  </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editParcel && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div 
            className="modal-content edit-modal headerless-modal" 
            style={{
              width: '90vw',
              maxWidth: 600,
              height: '80vh',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="floating-close-btn" onClick={() => setEditModalOpen(false)}>
              <FaTimes />
            </button>
            <div className="modal-body headerless-body" style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
              <div className="edit-parcel-info">
                <div className="info-row">
                  <span className="info-label">MC Code:</span>
                  <span className="info-value">{editParcel.MC_CODE}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Description:</span>
                  <span className="info-value">{editParcel.ARTICLE_DESCRIPTION}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Current Status:</span>
                  <span className={`status-badge ${editParcel.STATUS.toLowerCase()}`}>
                    {editParcel.STATUS === 'Pending' && <FaHourglassHalf />}
                    {editParcel.STATUS === 'Approved' && <FaCheckCircle />}
                    {editParcel.STATUS === 'Rejected' && <FaTimesCircle />}
                    <span>{editParcel.STATUS}</span>
                  </span>
                </div>
              </div>

              <div className="edit-actions-section">
                <h3>Update Article Status</h3>
                <div className="rejection-reason-section">
                  <label htmlFor="rejectionReason">Rejection Reason (required for rejection):</label>
                  <select
                    id="rejectionReason"
                    value={selectedRejectionReason}
                    onChange={(e) => {
                      setSelectedRejectionReason(e.target.value);
                      if (e.target.value !== 'Other') {
                        setCustomRejectionReason('');
                      }
                    }}
                    className="rejection-dropdown"
                  >
                    <option value="">Select a reason...</option>
                    <option value="Quality issues">Quality issues</option>
                    <option value="Specification mismatch">Specification mismatch</option>
                    <option value="Incomplete documentation">Incomplete documentation</option>
                    <option value="Price concerns">Price concerns</option>
                    <option value="Design not approved">Design not approved</option>
                    <option value="Material issues">Material issues</option>
                    <option value="Size/Fit problems">Size/Fit problems</option>
                    <option value="Color variations">Color variations</option>
                    <option value="Delivery delays">Delivery delays</option>
                    <option value="Other">Other (specify below)</option>
                  </select>
                  {selectedRejectionReason === 'Other' && (
                    <textarea
                      value={customRejectionReason}
                      onChange={(e) => setCustomRejectionReason(e.target.value)}
                      placeholder="Please specify the reason for rejection..."
                      rows={3}
                      className="rejection-textarea"
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </div>

                <div className="edit-action-buttons">
                  <button
                    className="edit-btn approve-btn"
                    onClick={handleEditApprove}
                    disabled={actionLoading === `edit-approve-${editParcel.ArticleId}`}
                  >
                    {actionLoading === `edit-approve-${editParcel.ArticleId}` ? (
                      <FaSync className="spinning" />
                    ) : (
                      <FaCheckCircle />
                    )}
                    Approve Article
                  </button>
                  
                  <button
                    className="edit-btn reject-btn"
                    onClick={handleEditReject}
                    disabled={actionLoading === `edit-reject-${editParcel.ArticleId}`}
                  >
                    {actionLoading === `edit-reject-${editParcel.ArticleId}` ? (
                      <FaSync className="spinning" />
                    ) : (
                      <FaTimesCircle />
                    )}
                    Reject Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelsList;
