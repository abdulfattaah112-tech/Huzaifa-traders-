import { fetchApi } from './client.js';

export const getCategories = async () => {
    return fetchApi('/categories');
};

export const createCategory = async (categoryData) => {
    return fetchApi('/categories', { method: 'POST', body: JSON.stringify(categoryData) });
};

export const deleteCategory = async (name) => {
    return fetchApi(`/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
};
