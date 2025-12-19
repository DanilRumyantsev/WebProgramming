import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const axiosInstance = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials: true,
});

const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export { axiosInstance, setAuthToken };