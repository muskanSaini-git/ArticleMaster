import React, { useState } from 'react';
import { FaTimes, FaInfoCircle, FaEdit, FaTh, FaCheckCircle, FaClock, FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';

const ViewModal = ({ 
  isOpen, 
  onClose, 
  selectedItem, 
  sectionVisibility, 
  toggleSection, 
  statusBadge, 
  handleImageError 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!isOpen || !selectedItem) return null;

  // Add dummy images if no images exist
  const itemWithDummyImages = {
    ...selectedItem,
    Images: selectedItem.Images && selectedItem.Images.length > 0 
      ? selectedItem.Images 
      : [
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZhZmFmYSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iI2RkZTRmNyIvPjxwYXRoIGQ9Ik03MCA5MGg2bC00LTEyaDR2MTJ6bTggMGg2bC00LTEyaDR2MTJ6IiBmaWxsPSIjZGRlNGY3Ii8+PHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdCBJbWFnZSAxPC90ZXh0Pjwvc3ZnPg==',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iI2U1ZThmMCIvPjxwYXRoIGQ9Ik03MCA5MGg2bC00LTEyaDR2MTJ6bTggMGg2bC00LTEyaDR2MTJ6IiBmaWxsPSIjZTVlOGYwIi8+PHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdCBJbWFnZSAyPC90ZXh0Pjwvc3ZnPg==',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iI2RkZTRmNyIvPjxwYXRoIGQ9Ik03MCA5MGg2bC00LTEyaDR2MTJ6bTggMGg2bC00LTEyaDR2MTJ6IiBmaWxsPSIjZGRlNGY3Ii8+PHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzU5NzNhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0IEltYWdlIDM8L3RleHQ+PC9zdmc+'
        ]
  };

  const nextImage = () => {
    if (itemWithDummyImages.Images && itemWithDummyImages.Images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === itemWithDummyImages.Images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (itemWithDummyImages.Images && itemWithDummyImages.Images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? itemWithDummyImages.Images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content headerless-modal"
        style={{
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          height: 'auto',
          overflowY: 'hidden',
          overflowX: 'hidden',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          margin: '15px auto',
          display: 'block',
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent transparent',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="floating-close-btn" onClick={onClose} style={{
          position: 'absolute',
          top: '12px',        // Reduced from 15px
          right: '12px',      // Reduced from 15px
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '28px',      // Reduced from 32px
          height: '28px',     // Reduced from 32px
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '12px'    // Reduced from 14px
        }}>
          <FaTimes />
        </button>
        
        <div className="modal-body headerless-body" style={{ 
          padding: '16px',
          background: 'transparent', 
          borderRadius: '0', 
          margin: '0',
          height: 'auto',
          maxHeight: 'calc(90vh - 60px)',
          overflowY: 'hidden',
          overflowX: 'hidden'
        }}>
          <div className="comprehensive-details-container" style={{ 
            height: 'auto',
            overflowY: 'hidden',
            overflowX: 'hidden'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}> {/* Reduced from 20px */}
              <h2 style={{ 
                color: '#000000', 
                fontSize: '1.2rem',    // Reduced from 1.3rem
                fontWeight: '700',
                marginBottom: '4px'    // Reduced from 6px
              }}>
                Article Details
              </h2>
              <div style={{ 
                color: '#374151', 
                fontSize: '0.8rem',    // Reduced from 0.9rem
                fontWeight: '500',
                padding: '4px 10px',   // Reduced from 6px 12px
                background: '#f3f4f6',
                borderRadius: '4px',    // Reduced from 6px
                display: 'inline-block'
              }}>
                {selectedItem.MC_CD || selectedItem.MC_CODE || 'N/A'}
              </div>
            </div>

            {/* Basic Information Section */}
            <div
              className="section-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#000000',
                padding: '12px 14px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection && toggleSection('basic')}
            >
              <FaInfoCircle style={{marginRight: 8, color: '#3b82f6', fontSize: '0.9rem'}} />
              Basic Information
              {sectionVisibility && sectionVisibility.basic ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility && sectionVisibility.basic && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                marginBottom: '16px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
                {[
                  { label: 'MC Code', value: selectedItem.MC_CD || selectedItem.MC_CODE || 'N/A' },
                  { label: 'Segment', value: selectedItem.FG_SEG || selectedItem.SEG || 'N/A' },
                  { label: 'Division', value: selectedItem.FG_DIV || selectedItem.DIV || 'N/A' },
                  { label: 'Major Category', value: selectedItem.MJ_CAT || selectedItem.MAJ_CAT_NM || 'N/A' },
                  { label: 'Description', value: selectedItem.ARTICLE_DESCRIPTION || selectedItem.MC_DESC || 'N/A' },
                  { label: 'Status', value: statusBadge(selectedItem.STATUS) },
                  { label: 'Submit Date', value: selectedItem.SUBMIT_DATE || selectedItem.ART_CR_DATE || 'N/A' },
                  { label: 'Submit By', value: selectedItem.SUBMIT_BY || selectedItem.CREATED_BY || 'N/A' },
                  { label: 'Approved By', value: selectedItem.APPROVED_BY || 'Not yet approved' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.7rem', marginRight: '6px' }}>
                      {item.label}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </span>
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
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#000000',
                padding: '12px 14px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection && toggleSection('garment')}
            >
              <FaEdit style={{marginRight: 8, color: '#10b981', fontSize: '0.9rem'}} />
              Garment Construction
              {sectionVisibility && sectionVisibility.garment ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility && sectionVisibility.garment && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                marginBottom: '16px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
                {[
                  { label: 'LCR/NON LCR', value: selectedItem.LCR_NON_LCR || 'N/A' },
                  { label: 'NECK', value: selectedItem.NECK || 'N/A' },
                  { label: 'NECK TYPE', value: selectedItem.NECK_TYPE || 'N/A' },
                  { label: 'NECK SIZE', value: selectedItem.NECK_SIZE || 'N/A' },
                  { label: 'PLACKET', value: selectedItem.PLACKET || 'N/A' },
                  { label: 'FATHER BELT', value: selectedItem.FATHER_BELT || 'N/A' },
                  { label: 'BELT DESIGN', value: selectedItem.BELT_DESIGN || 'N/A' },
                  { label: 'BLT SIZE', value: selectedItem.BLT_SIZE || 'N/A' },
                  { label: 'SLEEVE', value: selectedItem.SLEEVE || 'N/A' },
                  { label: 'SLEEVES MAIN STYLE', value: selectedItem.SLEEVES_MAIN_STYLE || 'N/A' },
                  { label: 'BTM FOLD', value: selectedItem.BTM_FOLD || selectedItem.BTFOLD || 'N/A' },
                  { label: 'BOTTOM OPEN WIDTH (INC)', value: selectedItem.BOTTOM_OPEN_WIDTH_INC || 'N/A' },
                  { label: 'SET', value: selectedItem.SET || 'N/A' },
                  { label: 'FO STYLE', value: selectedItem.FO_STYLE || 'N/A' },
                  { label: 'POCKET TYPE', value: selectedItem.POCKET_TYPE || 'N/A' },
                  { label: 'NO OF POCKET', value: selectedItem.NO_OF_POCKET || 'N/A' },
                  { label: 'FIT', value: selectedItem.FIT || 'N/A' },
                  { label: 'PATTERN', value: selectedItem.PATTERN || 'N/A' },
                  { label: 'LENGTH', value: selectedItem.LENGTH || 'N/A' },
                  { label: 'MEASUREMENT LENGTH (INCH)', value: selectedItem.MEASUREMENT_LENGTH_INCH || 'N/A' },
                  { label: 'DRAWCORD', value: selectedItem.DRAWCORD || 'N/A' },
                  { label: 'DRAWCORD STYLE', value: selectedItem.DRAWCORD_STYLE || 'N/A' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.7rem', marginRight: '6px' }}>
                      {item.label}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </span>
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
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#000000',
                padding: '12px 14px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection && toggleSection('hardware')}
            >
              <FaTh style={{marginRight: 8, color: '#f59e0b', fontSize: '0.9rem'}} />
              Hardware & Trims
              {sectionVisibility && sectionVisibility.hardware ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility && sectionVisibility.hardware && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                marginBottom: '16px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
                {[
                  { label: 'DRAWCORD LOOP', value: selectedItem.DRAWCORD_LOOP || 'N/A' },
                  { label: 'BUTTON', value: selectedItem.BUTTON || 'N/A' },
                  { label: 'BUTTON COLOR', value: selectedItem.BUTTON_COLOR || 'N/A' },
                  { label: 'ZIP', value: selectedItem.ZIP || 'N/A' },
                  { label: 'ZIP COL', value: selectedItem.ZIP_COL || 'N/A' },
                  { label: 'PRINT TYPE', value: selectedItem.PRINT_TYPE || 'N/A' },
                  { label: 'PRINT PLACEMENT', value: selectedItem.PRINT_PLACEMENT || 'N/A' },
                  { label: 'PRINT STYLE', value: selectedItem.PRINT_STYLE || 'N/A' },
                  { label: 'PATCHES', value: selectedItem.PATCHES || 'N/A' },
                  { label: 'PATCH TYPE', value: selectedItem.PATCH_TYPE || 'N/A' },
                  { label: 'EMBROIDERY', value: selectedItem.EMBROIDERY || 'N/A' },
                  { label: 'EMB TYPE', value: selectedItem.EMB_TYPE || 'N/A' },
                  { label: 'PLACEMENT', value: selectedItem.PLACEMENT || 'N/A' },
                  { label: 'ADD ACC1', value: selectedItem.ADD_ACC1 || 'N/A' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.7rem', marginRight: '6px' }}>
                      {item.label}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </span>
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
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#000000',
                padding: '12px 14px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection && toggleSection('final')}
            >
              <FaCheckCircle style={{marginRight: 8, color: '#10b981', fontSize: '0.9rem'}} />
              Final Details & Pricing
              {sectionVisibility && sectionVisibility.final ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility && sectionVisibility.final && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
                marginBottom: '16px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                maxHeight: '300px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
                {[
                  { label: 'WASH', value: selectedItem.WASH || 'N/A' },
                  { label: 'WASH COLOR', value: selectedItem.WASH_COLOR || 'N/A' },
                  { label: 'CLR', value: selectedItem.CLR || 'N/A' },
                  { label: 'SIZE', value: selectedItem.SIZE || 'N/A' },
                  { label: 'MRP', value: selectedItem.MRP ? `₹${selectedItem.MRP}` : 'N/A' },
                  { label: 'SEG', value: selectedItem.SEG || 'N/A' },
                  { label: 'ARTICLE TYPE', value: selectedItem.ARTICLE_TYPE || 'N/A' },
                  { label: 'BUYING TYPE', value: selectedItem.BUYING_TYPE || 'N/A' },
                  { label: 'PD', value: selectedItem.PD || 'N/A' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    maxHeight: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.7rem', marginRight: '6px' }}>
                      {item.label}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Images Section - Slider Card */}
            <div
              className="section-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#000000',
                padding: '12px 14px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection && toggleSection('images')}
            >
              <FiEye style={{marginRight: 8, color: '#8b5cf6', fontSize: '0.9rem'}} />
              Product Images ({itemWithDummyImages.Images.length})
              {sectionVisibility && sectionVisibility.images ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {(!sectionVisibility || sectionVisibility.images) && (
              <div style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.15)', 
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                maxHeight: '400px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
                {/* Image Slider Card */}
                {itemWithDummyImages.Images && itemWithDummyImages.Images.length > 0 ? (
                  <div style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Main Image Display */}
                    <div style={{
                      width: '100%',
                      height: '200px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8fafc'
                    }}>
                      <img 
                        src={itemWithDummyImages.Images[currentImageIndex]} 
                        alt={`${selectedItem.MC_CODE || 'Article'} ${currentImageIndex + 1}`} 
                        onError={(e) => handleImageError && handleImageError(itemWithDummyImages.Images[currentImageIndex], e)} 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '6px'
                        }}
                      />
                    </div>
                    
                    {/* Navigation Arrows */}
                    {itemWithDummyImages.Images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            zIndex: 10
                          }}
                        >
                          <FaChevronLeft />
                        </button>
                        
                        <button 
                          onClick={nextImage}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            zIndex: 10
                          }}
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      {currentImageIndex + 1} / {itemWithDummyImages.Images.length}
                    </div>
                  </div>
                ) : (
                  /* No Images Message */
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    No images available for this article
              </div>
            )}

                {/* Thumbnail Navigation */}
                {itemWithDummyImages.Images && itemWithDummyImages.Images.length > 1 && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {itemWithDummyImages.Images.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: idx === currentImageIndex ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                          opacity: idx === currentImageIndex ? 1 : 0.7,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal; 