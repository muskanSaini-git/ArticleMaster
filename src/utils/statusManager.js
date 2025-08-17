// Status Manager for Article Approval Workflow

// Status constants
export const ARTICLE_STATUSES = {
  // Initial status
  DRAFT: 'Draft',
  
  // Sent for approval
  SENT: 'Sent',
  
  // Approved by different roles
  APPROVED_PO: 'Approved PO',
  APPROVED_MERCHANT: 'Approved Merchant',
  APPROVED_ADMIN: 'Approved Admin',
  
  // Rejected by different roles
  REJECTED_PO: 'Rejected PO',
  REJECTED_MERCHANT: 'Rejected Merchant',
  REJECTED_ADMIN: 'Rejected Admin'
};

// Get next status based on current status and action
export const getNextStatus = (currentStatus, action, role) => {
  switch (currentStatus) {
    case ARTICLE_STATUSES.DRAFT:
      if (action === 'send_for_approval') {
        return ARTICLE_STATUSES.SENT;
      }
      break;
      
    case ARTICLE_STATUSES.SENT:
      if (action === 'approve') {
        if (role === 'purchase') {
          return ARTICLE_STATUSES.APPROVED_PO;
        } else if (role === 'merchant') {
          return ARTICLE_STATUSES.APPROVED_MERCHANT;
        } else if (role === 'admin') {
          return ARTICLE_STATUSES.APPROVED_ADMIN;
        }
      } else if (action === 'reject') {
        if (role === 'purchase') {
          return ARTICLE_STATUSES.REJECTED_PO;
        } else if (role === 'merchant') {
          return ARTICLE_STATUSES.REJECTED_MERCHANT;
        } else if (role === 'admin') {
          return ARTICLE_STATUSES.REJECTED_ADMIN;
        }
      }
      break;
      
    case ARTICLE_STATUSES.APPROVED_PO:
      if (action === 'approve' && role === 'merchant') {
        return ARTICLE_STATUSES.APPROVED_MERCHANT;
      } else if (action === 'reject' && role === 'merchant') {
        return ARTICLE_STATUSES.REJECTED_MERCHANT;
      }
      break;
      
    case ARTICLE_STATUSES.APPROVED_MERCHANT:
      if (action === 'approve' && role === 'admin') {
        return ARTICLE_STATUSES.APPROVED_ADMIN;
      } else if (action === 'reject' && role === 'admin') {
        return ARTICLE_STATUSES.REJECTED_ADMIN;
      }
      break;
      
    default:
      return currentStatus;
  }
  
  return currentStatus;
};

// Check if status can be changed by current role
export const canChangeStatus = (currentStatus, role) => {
  switch (currentStatus) {
    case ARTICLE_STATUSES.SENT:
      return ['purchase', 'merchant', 'admin'].includes(role);
      
    case ARTICLE_STATUSES.APPROVED_PO:
      return ['merchant', 'admin'].includes(role);
      
    case ARTICLE_STATUSES.APPROVED_MERCHANT:
      return ['admin'].includes(role);
      
    default:
      return false;
  }
};

// Get status color for UI display
export const getStatusColor = (status) => {
  switch (status) {
    case ARTICLE_STATUSES.DRAFT:
      return '#6b7280'; // Gray
      
    case ARTICLE_STATUSES.SENT:
      return '#f59e0b'; // Yellow/Orange
      
    case ARTICLE_STATUSES.APPROVED_PO:
    case ARTICLE_STATUSES.APPROVED_MERCHANT:
    case ARTICLE_STATUSES.APPROVED_ADMIN:
      return '#10b981'; // Green
      
    case ARTICLE_STATUSES.REJECTED_PO:
    case ARTICLE_STATUSES.REJECTED_MERCHANT:
    case ARTICLE_STATUSES.REJECTED_ADMIN:
      return '#ef4444'; // Red
      
    default:
      return '#6b7280'; // Gray
  }
};

// Get readable status label
export const getStatusLabel = (status) => {
  switch (status) {
    case ARTICLE_STATUSES.DRAFT:
      return 'Draft';
      
    case ARTICLE_STATUSES.SENT:
      return 'Sent for Approval';
      
    case ARTICLE_STATUSES.APPROVED_PO:
      return 'Approved by PO';
      
    case ARTICLE_STATUSES.APPROVED_MERCHANT:
      return 'Approved by Merchant';
      
    case ARTICLE_STATUSES.APPROVED_ADMIN:
      return 'Approved by Admin';
      
    case ARTICLE_STATUSES.REJECTED_PO:
      return 'Rejected by PO';
      
    case ARTICLE_STATUSES.REJECTED_MERCHANT:
      return 'Rejected by Merchant';
      
    case ARTICLE_STATUSES.REJECTED_ADMIN:
      return 'Rejected by Admin';
      
    default:
      return status;
  }
};

// Check if article is in final approved state
export const isFullyApproved = (status) => {
  return status === ARTICLE_STATUSES.APPROVED_ADMIN;
};

// Check if article is in final rejected state
export const isFullyRejected = (status) => {
  return [
    ARTICLE_STATUSES.REJECTED_PO,
    ARTICLE_STATUSES.REJECTED_MERCHANT,
    ARTICLE_STATUSES.REJECTED_ADMIN
  ].includes(status);
};

// Get workflow step for current status
export const getWorkflowStep = (status) => {
  switch (status) {
    case ARTICLE_STATUSES.DRAFT:
      return 1;
      
    case ARTICLE_STATUSES.SENT:
      return 2;
      
    case ARTICLE_STATUSES.APPROVED_PO:
      return 3;
      
    case ARTICLE_STATUSES.APPROVED_MERCHANT:
      return 4;
      
    case ARTICLE_STATUSES.APPROVED_ADMIN:
      return 5;
      
    case ARTICLE_STATUSES.REJECTED_PO:
    case ARTICLE_STATUSES.REJECTED_MERCHANT:
    case ARTICLE_STATUSES.REJECTED_ADMIN:
      return -1; // Rejected
      
    default:
      return 0;
  }
};
