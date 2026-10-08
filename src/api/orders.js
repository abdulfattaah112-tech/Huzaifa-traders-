import { fetchApi } from './client.js';

export const getOrders = async () => {
    return fetchApi('/orders/admin');
};

export const createOrder = async (orderData) => {
    return fetchApi('/orders', { method: 'POST', body: JSON.stringify(orderData) });
};

export const updateOrderStatus = async (id, status) => {
    return fetchApi(`/orders/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
};

export const updateOrderNotes = async (id, notes) => {
    return fetchApi(`/orders/admin/${id}/notes`, { method: 'PATCH', body: JSON.stringify({ internal_notes: notes }) });
};

export const deleteOrder = async (id) => {
    return fetchApi(`/orders/admin/${id}`, { method: 'DELETE' });
};

export const deleteCompletedOrders = async () => {
    return fetchApi('/orders/admin/status/completed', { method: 'DELETE' });
};
