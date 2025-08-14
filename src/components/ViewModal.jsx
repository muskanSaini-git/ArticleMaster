import React from 'react';
import { FaTimes, FaInfoCircle, FaEdit, FaTh, FaCheckCircle, FaClock, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const ViewModal = ({ 
  isOpen, 
  onClose, 
  selectedItem, 
  sectionVisibility, 
  toggleSection, 
  statusBadge
}) => {
  if (!isOpen || !selectedItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content headerless-modal"
        style={{
          maxWidth: '800px',
          width: '95%',
          maxHeight: '85vh',
          height: 'auto',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          margin: '20px auto',
          display: 'block',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="floating-close-btn" onClick={onClose} style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '14px'
        }}>
          <FaTimes />
        </button>
        
        <div className="modal-body headerless-body" style={{ 
          padding: '25px', 
          background: 'transparent', 
          borderRadius: '0', 
          margin: '0',
          minHeight: '400px',
          maxHeight: 'calc(85vh - 50px)',
          overflowY: 'auto'
        }}>
          <div className="comprehensive-details-container" style={{ 
            height: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <h2 style={{ 
                color: '#000000', 
                fontSize: '1.5rem', 
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                Article Parcel Details
              </h2>
              <div style={{ 
                color: '#374151', 
                fontSize: '1rem',
                fontWeight: '500',
                padding: '8px 16px',
                background: '#f3f4f6',
                borderRadius: '8px',
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
                marginBottom: '20px',
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#000000',
                padding: '18px 20px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection('basic')}
            >
              <FaInfoCircle style={{marginRight: 12, color: '#3b82f6', fontSize: '1.1rem'}} /> 
              Basic Information
              {sectionVisibility.basic ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility.basic && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '25px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                {[
                  { label: 'Vendor Code', value: selectedItem.VND_CD || 'N/A' },
                  { label: 'Article Description', value: selectedItem.ARTICLE_DESCRIPTION || 'N/A' },
                  { label: 'MC Code', value: selectedItem.MC_CD || selectedItem.MC_CODE || 'N/A' },
                  { label: 'Article Creation Date', value: selectedItem.ART_CR_DATE || 'N/A' },
                  { label: 'Fabric Segment', value: selectedItem.FG_SEG || 'N/A' },
                  { label: 'Fabric Division', value: selectedItem.FG_DIV || 'N/A' },
                  { label: 'Major Category', value: selectedItem.MJ_CAT || 'N/A' },
                  { label: 'Sub Division', value: selectedItem.SUB_DIV || 'N/A' },
                  { label: 'Material Code Style', value: selectedItem.MC_ST || 'N/A' },
                  { label: 'General Article', value: selectedItem.GEN_ART || 'N/A' },
                  { label: 'HSN Code', value: selectedItem.HSN_CODE || 'N/A' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '0.9rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Details Section */}
            <div
              className="section-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '20px',
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#000000',
                padding: '18px 20px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection('additional')}
            >
              <FaEdit style={{marginRight: 12, color: '#10b981', fontSize: '1.1rem'}} /> 
              Additional Details
              {sectionVisibility.additional ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility.additional && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '25px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                {[
                  { label: 'Vendor Name', value: selectedItem.VND_NM || 'N/A' },
                  { label: 'Vendor Dozen Number', value: selectedItem.VND_DZN_NO || 'N/A' },
                  { label: 'Maximum Retail Price', value: selectedItem.MRP || 'N/A' },
                  { label: 'Number of Articles', value: selectedItem.NOA || 'N/A' },
                  { label: 'Range Segment', value: selectedItem.RNG_SEG || 'N/A' },
                  { label: 'Main MVGR', value: selectedItem.MAIN_MVGR || 'N/A' },
                  { label: 'Macro MVGR', value: selectedItem.MACRO_MVGR || 'N/A' },
                  { label: 'Micro MVGR', value: selectedItem.MICRO_MVGR || 'N/A' },
                  { label: 'Fabric Division', value: selectedItem.FAB_DIV || 'N/A' },
                  { label: 'Weave Type', value: selectedItem.WEAVE || 'N/A' },
                  { label: 'Weave Type 2', value: selectedItem.WEAVE_2 || 'N/A' },
                  { label: 'Material Composition', value: selectedItem.COMPOSITION || 'N/A' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '0.9rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Section */}
            <div
              className="section-title"
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '20px',
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#000000',
                padding: '18px 20px',
                background: 'rgba(249, 250, 251, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onClick={() => toggleSection('status')}
            >
              <FaCheckCircle style={{marginRight: 12, color: '#059669', fontSize: '1.1rem'}} /> 
              Status Information
              {sectionVisibility.status ? 
                <FaChevronUp style={{marginLeft: 'auto', color: '#6b7280'}} /> :
                <FaChevronDown style={{marginLeft: 'auto', color: '#6b7280'}} />
              }
            </div>
            {sectionVisibility.status && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginBottom: '25px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                {[
                  { label: 'Status', value: statusBadge(selectedItem.STATUS) },
                  { label: 'Created Date', value: selectedItem.ART_CR_DATE || 'N/A' },
                  { label: 'Created By', value: selectedItem.CREATED_BY || 'N/A' },
                  { label: 'Approved By', value: selectedItem.APPROVED_BY || 'Not yet approved' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', fontSize: '0.9rem' }}>
                      {item.label}
                    </div>
                    <div style={{ color: '#1f2937', fontWeight: '500', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal; 