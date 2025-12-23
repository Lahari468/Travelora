import axios from 'axios';

const API_URL = 'http://localhost:3002';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPlaces = async (query = '') => {
    const url = query ? `/places?q=${query}` : '/places';
    const response = await api.get(url);
    return response.data;
};

export const getPlaceById = async (id) => {
    const response = await api.get(`/places/${id}`);
    return response.data;
};

export const getHotelsByPlaceId = async (placeId) => {
    const response = await api.get(`/hotels?placeId=${placeId}`);
    return response.data;
};

export const getHotelById = async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
};

export const getAllHotels = async () => {
    const response = await api.get('/hotels');
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const updateHotelRooms = async (hotelId, roomsAvailable) => {
    const response = await api.patch(`/hotels/${hotelId}`, { roomsAvailable });
    return response.data;
};

export const getUserBookings = async (userId) => {
    const response = await api.get(`/bookings?userId=${userId}`);
    return response.data;
};

export const cancelBooking = async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}`, { status: 'cancelled' });
    return response.data;
};

export const updateUserBookmarks = async (userId, bookmarks) => {
    const response = await api.patch(`/users/${userId}`, { bookmarks });
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

export const getPackages = async () => {
    const response = await api.get('/packages');
    return response.data;
};

export default api;
