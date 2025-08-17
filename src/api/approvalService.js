import apiClient from './client';
import config from '../config';
import jwtService from '../utils/jwtService';

// Approval Service for handling approval workflows
class ApprovalService {
  constructor() {
    this.baseUrl = config.asnBaseUrl;
  }

  // Send articles for approval
  async sendArticlesForApproval(articleIds) {
    try {
      console.log('📤 Sending articles for approval:', articleIds);
      
      const url = `${config.endpoints.approval.sendForApproval}?articleIds=${articleIds.join(',')}`;
      const result = await apiClient.asnPost(url);
      
      console.log('✅ Articles sent for approval:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending articles for approval:', error);
      throw error;
    }
  }

  // Approve articles by level
  async approveByLevel(articleIds, action, remarks = '') {
    try {
      console.log(`✅ Approving articles: ${articleIds}, Action: ${action}, Remarks: ${remarks}`);
      
      const payload = {
        ArticleIds: articleIds.join(','),
        Action: action,
        Remarks: remarks
      };
      
      const result = await apiClient.asnPost(config.endpoints.approval.approveByLevel, payload);
      
      console.log('✅ Articles approved:', result);
      return result;
    } catch (error) {
      console.error('❌ Error approving articles:', error);
      throw error;
    }
  }

  // Get approval status
  async getApprovalStatus(articleId) {
    try {
      console.log('🔍 Getting approval status for article:', articleId);
      
      const url = `${config.endpoints.approval.getStatus}?articleId=${articleId}`;
      const result = await apiClient.asnGet(url);
      
      console.log('✅ Approval status:', result);
      return result;
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
