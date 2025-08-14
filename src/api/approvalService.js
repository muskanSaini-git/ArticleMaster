import hybridClient from './hybridClient';
import jwtService from '../utils/jwtService';

// Approval Service for handling approval workflows
class ApprovalService {
  constructor() {
    this.baseUrl = 'http://192.168.149.75';
  }

  // Send articles for approval
  async sendArticlesForApproval(articleIds) {
    try {
      console.log('📤 Sending articles for approval:', articleIds);
      
      const response = await hybridClient.fetch(
        `${this.baseUrl}/api/Approval/SendArticlesForApproval?articleIds=${articleIds.join(',')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtService.getAuthHeader()
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Articles sent for approval:', result);
        return result;
      } else {
        throw new Error(`Failed to send articles for approval: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error sending articles for approval:', error);
      throw error;
    }
  }

  // Approve articles by level
  async approveByLevel(articleIds, action, remarks = '') {
    try {
      console.log(`✅ Approving articles: ${articleIds}, Action: ${action}, Remarks: ${remarks}`);
      
      const response = await hybridClient.fetch(
        `${this.baseUrl}/api/Approval/ApproveByLevel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtService.getAuthHeader()
          },
          body: JSON.stringify({
            ArticleIds: articleIds.join(','),
            Action: action,
            Remarks: remarks
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Articles approved:', result);
        return result;
      } else {
        throw new Error(`Failed to approve articles: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error approving articles:', error);
      throw error;
    }
  }

  // Get approval status
  async getApprovalStatus(articleId) {
    try {
      console.log('🔍 Getting approval status for article:', articleId);
      
      const response = await hybridClient.fetch(
        `${this.baseUrl}/api/Approval/GetApprovalStatus?articleId=${articleId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': jwtService.getAuthHeader()
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Approval status:', result);
        return result;
      } else {
        throw new Error(`Failed to get approval status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error getting approval status:', error);
      throw error;
    }
  }

  // Check if user can perform approval actions
  canApprove() {
    return jwtService.canApprove();
  }

  // Check if user can send for approval
  canSendForApproval() {
    return jwtService.canSendForApproval();
  }

  // Get user role
  getUserRole() {
    const userData = jwtService.getUserData();
    return userData?.roleName;
  }
}

// Create singleton instance
const approvalService = new ApprovalService();

export default approvalService;
