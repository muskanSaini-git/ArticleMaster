import React from 'react';
import { FaTimes, FaInfoCircle, FaEdit, FaTh, FaCheckCircle, FaClock, FaChevronUp, FaChevronDown } from 'react-icons/fa';
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
  if (!isOpen || !selectedItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
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
        <button className="floating-close-btn" onClick={onClose}>
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
                {selectedItem.MC_CD || selectedItem.MC_CODE}
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
                  { label: 'MC Code', value: selectedItem.MC_CODE },
                  { label: 'Segment', value: selectedItem.SEG },
                  { label: 'Division', value: selectedItem.DIV },
                  { label: 'Major Category', value: selectedItem.MAJ_CAT_NM },
                  { label: 'Description', value: selectedItem.ARTICLE_DESCRIPTION },
                  { label: 'Status', value: statusBadge(selectedItem.STATUS) },
                  { label: 'Submit Date', value: selectedItem.SUBMIT_DATE },
                  { label: 'Submit By', value: selectedItem.SUBMIT_BY },
                  { label: 'Approved By', value: selectedItem.APPROVED_BY || 'Not yet approved' }
                ].map((item, index) => (
                  <div key={index} style={{
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
                  { label: 'LCR/NON LCR', value: selectedItem.LCR_NON_LCR },
                  { label: 'NECK', value: selectedItem.NECK },
                  { label: 'NECK TYPE', value: selectedItem.NECK_TYPE },
                  { label: 'NECK SIZE', value: selectedItem.NECK_SIZE },
                  { label: 'PLACKET', value: selectedItem.PLACKET },
                  { label: 'FATHER BELT', value: selectedItem.FATHER_BELT },
                  { label: 'BELT DESIGN', value: selectedItem.BELT_DESIGN },
                  { label: 'BLT SIZE', value: selectedItem.BLT_SIZE },
                  { label: 'SLEEVE', value: selectedItem.SLEEVE },
                  { label: 'BTM FOLD', value: selectedItem.BTM_FOLD },
                  { label: 'BOTTOM OPEN WIDTH (INC)', value: selectedItem.BOTTOM_OPEN_WIDTH_INC },
                  { label: 'SET', value: selectedItem.SET },
                  { label: 'FO STYLE', value: selectedItem.FO_STYLE },
                  { label: 'POCKET TYPE', value: selectedItem.POCKET_TYPE },
                  { label: 'NO OF POCKET', value: selectedItem.NO_OF_POCKET },
                  { label: 'FIT', value: selectedItem.FIT },
                  { label: 'PATTERN', value: selectedItem.PATTERN },
                  { label: 'LENGTH', value: selectedItem.LENGTH },
                  { label: 'MEASUREMENT LENGTH (INCH)', value: selectedItem.MEASUREMENT_LENGTH_INCH },
                  { label: 'DRAWCORD', value: selectedItem.DRAWCORD },
                  { label: 'DRAWCORD STYLE', value: selectedItem.DRAWCORD_STYLE }
                ].map((item, index) => (
                  <div key={index} style={{
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
                  { label: 'DRAWCORD LOOP', value: selectedItem.DRAWCORD_LOOP },
                  { label: 'BUTTON', value: selectedItem.BUTTON },
                  { label: 'BUTTON COLOR', value: selectedItem.BUTTON_COLOR },
                  { label: 'ZIP', value: selectedItem.ZIP },
                  { label: 'ZIP COL', value: selectedItem.ZIP_COL },
                  { label: 'PRINT TYPE', value: selectedItem.PRINT_TYPE },
                  { label: 'PRINT PLACEMENT', value: selectedItem.PRINT_PLACEMENT },
                  { label: 'PRINT STYLE', value: selectedItem.PRINT_STYLE },
                  { label: 'PATCHES', value: selectedItem.PATCHES },
                  { label: 'PATCH TYPE', value: selectedItem.PATCH_TYPE },
                  { label: 'EMBROIDERY', value: selectedItem.EMBROIDERY },
                  { label: 'EMB TYPE', value: selectedItem.EMB_TYPE },
                  { label: 'PLACEMENT', value: selectedItem.PLACEMENT },
                  { label: 'ADD ACC1', value: selectedItem.ADD_ACC1 }
                ].map((item, index) => (
                  <div key={index} style={{
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
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                {[
                  { label: 'WASH', value: selectedItem.WASH },
                  { label: 'WASH COLOR', value: selectedItem.WASH_COLOR },
                  { label: 'CLR', value: selectedItem.CLR },
                  { label: 'SIZE', value: selectedItem.SIZE },
                  { label: 'MRP', value: `₹${selectedItem.MRP}` },
                  { label: 'SEG', value: selectedItem.SEG },
                  { label: 'ARTICLE TYPE', value: selectedItem.ARTICLE_TYPE },
                  { label: 'BUYING TYPE', value: selectedItem.BUYING_TYPE },
                  { label: 'PD', value: selectedItem.PD }
                ].map((item, index) => (
                  <div key={index} style={{
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
                  { label: 'Status', value: statusBadge(selectedItem.STATUS) },
                  { label: 'Submit Date', value: selectedItem.SUBMIT_DATE },
                  { label: 'Submitted By', value: selectedItem.SUBMIT_BY },
                  { label: 'Approved By', value: selectedItem.APPROVED_BY || 'Not yet approved' }
                ].map((item, index) => (
                  <div key={index} style={{
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

            {/* Images Section */}
            {selectedItem.Images && selectedItem.Images.length > 0 && (
              <>
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
                    padding: '10px', 
                    background: '#f8fafc', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    marginBottom: '30px' 
                  }}>
                    <div className="modal-image-gallery">
                      {selectedItem.Images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`${selectedItem.MC_CODE} ${idx + 1}`} 
                          className="modal-image" 
                          onError={(e) => handleImageError && handleImageError(img, e)} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal; 