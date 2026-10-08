import { fetchApi } from './client.js';

export const getBusinessDetails = async () => {
    return fetchApi('/business-details');
};

export const updateBusinessDetails = async (id, details) => {
    return fetchApi(`/business-details/${id}`, { method: 'PATCH', body: JSON.stringify(details) });
};
