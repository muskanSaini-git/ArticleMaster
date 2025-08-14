import api from './client';

// Helpers
const qs = (params) => new URLSearchParams(params).toString();

// Basic Article API functions
export async function getAllArticleDetails({ pageNumber = 1, pageSize = 10, searchText = '', statusId = 1 } = {}) {
  const url = `/api/Article/GetAllArticleMasterDetail?${qs({ pageNumber, pageSize, searchText, StatusId: statusId })}`;
  const { data } = await api.get(url);
  return data;
}

export async function uploadArticleExcel(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/Article/UploadArticleExcel', formData, {
    headers: { accept: 'application/json' },
  });
  return data;
}

export async function insertArticleList(articles) {
  const { data } = await api.post('/api/Article/InsertArticleData', articles, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export async function getArticleById(articleId) {
  const { data } = await api.get(`/api/Article/GetArticleMasterDetailById?${qs({ id: articleId })}`);
  return data;
}

export async function updateArticle(payload) {
  const { data } = await api.post('/api/Article/UpdateArticleById', payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export async function deleteArticles({ articleIds, deletedBy }) {
  const { data } = await api.post(`/api/Article/DeleteArticleDetails?${qs({ articleIds, deletedBy })}`, null, {
    headers: { accept: 'application/json' },
  });
  return data;
}

export async function sendArticlesForApproval({ articleIds, updatedBy }) {
  const { data } = await api.post(`/api/Article/SendArticlesForApproval?${qs({ articleIds, updatedBy })}`, null, {
    headers: { accept: 'application/json' },
  });
  return data;
}


