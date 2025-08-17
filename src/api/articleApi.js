import apiClient from './client';
import config from '../config';

// Helpers
const qs = (params) => new URLSearchParams(params).toString();

// Basic Article API functions
export async function getAllArticleDetails({ pageNumber = 1, pageSize = 10, searchText = '', statusId = 1 } = {}) {
  const url = `${config.endpoints.article.getAll}?${qs({ pageNumber, pageSize, searchText, StatusId: statusId })}`;
  return await apiClient.get(url);
}

export async function uploadArticleExcel(file) {
  return await apiClient.uploadFile(config.endpoints.article.uploadExcel, file);
}

export async function insertArticleList(articles) {
  return await apiClient.post(config.endpoints.article.insert, articles);
}

export async function getArticleById(articleId) {
  const url = `${config.endpoints.article.getById}?${qs({ id: articleId })}`;
  return await apiClient.get(url);
}

export async function updateArticle(payload) {
  return await apiClient.put(config.endpoints.article.update, payload);
}

export async function deleteArticles({ articleIds, deletedBy }) {
  const url = `${config.endpoints.article.delete}?${qs({ articleIds, deletedBy })}`;
  return await apiClient.delete(url);
}

export async function sendArticlesForApproval({ articleIds, updatedBy }) {
  const url = `${config.endpoints.article.sendForApproval}?${qs({ articleIds, updatedBy })}`;
  return await apiClient.post(url);
}

// Dropdown data APIs
export async function getSegments() {
  return await apiClient.asnGet(config.endpoints.dropdown.segments);
}

export async function getDivisionsBySegment(segmentId) {
  const url = `${config.endpoints.dropdown.divisions}?${qs({ segmentId })}`;
  return await apiClient.asnGet(url);
}

export async function getSubDivisions(divisionId) {
  const url = `${config.endpoints.dropdown.subDivisions}?${qs({ divisionId })}`;
  return await apiClient.asnGet(url);
}

export async function getMajorCategories(subDivisionId) {
  const url = `${config.endpoints.dropdown.categories}?${qs({ subDivisionId })}`;
  return await apiClient.asnGet(url);
}

export async function getMcCodes(categoryId) {
  const url = `${config.endpoints.dropdown.mcCodes}?${qs({ categoryId })}`;
  return await apiClient.asnGet(url);
}

export async function getMcDescriptions(mcCodeId) {
  const url = `${config.endpoints.dropdown.descriptions}?${qs({ mcCodeId })}`;
  return await apiClient.asnGet(url);
}

export async function getMcstDetails(mcDescriptionId) {
  const url = `${config.endpoints.dropdown.mcstDetails}?${qs({ mcDescriptionId })}`;
  return await apiClient.asnGet(url);
}

// Dynamic dropdown data
export async function getDynamicDropdownData(dropdownType, params = {}) {
  const url = `${config.endpoints.dropdown.dynamic}?${qs({ dropdownType, ...params })}`;
  return await apiClient.asnGet(url);
}


