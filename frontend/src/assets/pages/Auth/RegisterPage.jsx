import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await onRegister(email, password);
        if (result?.success) {
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-black p-6 text-white text-center">
                    <h1 className="text-2xl font-bold select-none">Регистрация</h1>
                    <p className="text-stone-100 mt-1 select-none">Интернет-магазин</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Пароль (мин. 6 символов)"
                                minLength="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-stone-700 transition shadow-md cursor-pointer"
                        >
                            Зарегистрироваться
                        </button>
                    </form>

                    <button
                        onClick={() => (window.location.href = '/login')}
                        className="w-full mt-4 text-black font-medium hover:text-stone-700 transition cursor-pointer"
                    >
                        Уже есть аккаунт? Войти
                    </button>
                </div>
            </div>
        </div>
    );
}