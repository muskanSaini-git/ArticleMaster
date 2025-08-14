import React from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaSync, FaHourglassHalf } from 'react-icons/fa';

const EditModal = ({ 
  isOpen, 
  onClose, 
  editItem, 
  selectedRejectionReason,
  setSelectedRejectionReason,
  customRejectionReason,
  setCustomRejectionReason,
  handleEditApprove,
  handleEditReject,
  actionLoading
}) => {
  if (!isOpen || !editItem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content edit-modal headerless-modal"
        style={{
          width: '90vw',
          maxWidth: 600,
          height: '80vh',
          maxHeight: '90vh',
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
          padding: '20px', 
          background: 'transparent', 
          borderRadius: '0', 
          margin: '0',
          overflowY: 'auto',
          maxHeight: 'calc(80vh - 60px)'
        }}>
          <div className="edit-parcel-info">
            <div className="info-row">
              <span className="info-label">MC Code:</span>
              <span className="info-value">{editItem.MC_CODE}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Description:</span>
              <span className="info-value">{editItem.ARTICLE_DESCRIPTION}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Current Status:</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: editItem.STATUS === 'Pending' ? '#f59e0b' : 
                       editItem.STATUS === 'Approved' ? '#10b981' : '#ef4444'
              }}>
                {editItem.STATUS === 'Pending' && <FaHourglassHalf />}
                {editItem.STATUS === 'Approved' && <FaCheckCircle />}
                {editItem.STATUS === 'Rejected' && <FaTimesCircle />}
                <span>{editItem.STATUS}</span>
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
                disabled={actionLoading === `edit-approve-${editItem.ArticleId}`}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                {actionLoading === `edit-approve-${editItem.ArticleId}` ? (
                  <FaSync className="spinning" />
                ) : (
                  <FaCheckCircle />
                )}
                Approve Article
              </button>
              <button 
                className="edit-btn reject-btn" 
                onClick={handleEditReject} 
                disabled={actionLoading === `edit-reject-${editItem.ArticleId}`}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
              >
                {actionLoading === `edit-reject-${editItem.ArticleId}` ? (
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
  );
};

export default EditModal; 