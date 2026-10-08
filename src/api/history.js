import { fetchApi } from './client.js';

export const getHistory = async () => {
    return fetchApi('/history');
};

export const createHistory = async (historyData) => {
    return fetchApi('/history', { method: 'POST', body: JSON.stringify(historyData) });
};

export const updateHistory = async (id, historyData) => {
    return fetchApi(`/history/${id}`, { method: 'PUT', body: JSON.stringify(historyData) });
};

export const deleteHistory = async (id) => {
    return fetchApi(`/history/${id}`, { method: 'DELETE' });
};
