import {useState, useEffect} from 'react';
import {axiosInstance, setAuthToken} from '../api/axiosInstance';

export function useAuth() {
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const checkAuth = async () => {
        try {
            const res = await axiosInstance.get('/auth/profile');
            setProfile(res.data.profile);
            setMessage('');
        } catch (err) {
            setProfile(null);
            if (err.response?.status !== 401) {
                setMessage('Ошибка при проверке авторизации');
            }
        } finally {
            setIsAuthChecked(true);
        }
    };

    useEffect(() => {
        axiosInstance.get('/health')
            .then(() => setMessage('Бэкенд работает'))
            .catch(() => setMessage('Бэкенд не отвечает'));

        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axiosInstance.post('/auth/login', {email, password});
            setProfile(res.data.user);
            setMessage('Вход успешен!');
            return {success: true};
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка сервера';
            setMessage(msg);
            return {success: false, error: msg};
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axiosInstance.post('/auth/register', {email, password});
            setProfile(res.data.user);
            setMessage('Регистрация успешна!');
            return {success: true};
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка сервера';
            setMessage(msg);
            return {success: false, error: msg};
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (e) {
            console.warn('Logout failed, continuing...');
        }
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