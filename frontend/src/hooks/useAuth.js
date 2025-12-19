import { useState, useEffect } from 'react';
import { axiosInstance, setAuthToken } from '../api/axiosInstance';

export function useAuth() {
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            axiosInstance
                .get('/health')
                .then(() => setMessage('Бэкенд работает'))
                .catch(() => setMessage('Бэкенд не отвечает'));

            const token = localStorage.getItem('token');

            if (token) {
                setAuthToken(token);
                try {
                    const res = await axiosInstance.get('/auth/profile');
                    setProfile(res.data.profile);
                } catch (err) {
                    localStorage.removeItem('token');
                    setAuthToken(null);
                }
            }
            setIsAuthChecked(true);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axiosInstance.post('/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setAuthToken(token);
            setProfile(user);
            setMessage('Вход успешен!');
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка сервера';
            setMessage(`${msg}`);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axiosInstance.post('/auth/register', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setAuthToken(token);
            setProfile(user);
            setMessage('Регистрация успешна!');
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка сервера';
            setMessage(`${msg}`);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setProfile(null);
    };

    return {
        profile,
        message,
        loading,
        isAuthChecked,
        login,
        register,
        logout,
    };
}