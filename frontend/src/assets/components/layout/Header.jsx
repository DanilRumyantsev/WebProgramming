import { Link } from 'react-router-dom';
import {useAuth} from "../../../hooks/useAuth.js";

export default function Header() {
    const { profile, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-black select-none">
                    Shop<span className="text-orange-600 select-none">Hub</span>
                </Link>

                <div className="flex-1 max-w-lg mx-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск товаров..."
                            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <a
                        href="/groups"
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                    >
                        Управление группами
                    </a>
                    <a
                        href="/products/manage"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Управление товарами
                    </a>
                </div>

                {/* Аватар / Профиль + Настройки */}
                <div className="flex items-center space-x-4">
                    {profile ? (
                        <>
                            <button
                                onClick={logout}
                                className="text-gray-600 hover:text-gray-900 transition"
                                title="Выйти"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    ></path>
                                </svg>
                            </button>
                            <Link
                                to="/profile"
                                className="flex items-center w-8 h-8 rounded-full bg-gray-200 text-black font-bold text-sm justify-center select-none"
                                title={profile.email}
                            >
                                {profile.email?.charAt(0).toUpperCase()}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-black"
                            >
                                Войти
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 py-1 text-sm font-medium bg-black text-white rounded hover:bg-stone-800 transition"
                            >
                                Регистрация
                            </Link>
                        </>
                    )}

                    <button
                        className="text-gray-600 hover:text-gray-900 transition"
                        title="Настройки"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.717.437 1.572.437 2.289 0z"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}