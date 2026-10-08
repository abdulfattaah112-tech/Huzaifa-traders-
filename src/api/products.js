import { fetchApi } from './client.js';

export const getProducts = async () => {
    return fetchApi('/products');
};

export const createProduct = async (productData) => {
    return fetchApi('/products', { method: 'POST', body: JSON.stringify(productData) });
};

export const updateProduct = async (id, productData) => {
    return fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
};

export const deleteProduct = async (id) => {
    return fetchApi(`/products/${id}`, { method: 'DELETE' });
};
