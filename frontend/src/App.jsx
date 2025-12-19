import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './assets/pages/Auth/LoginPage.jsx';
import RegisterPage from './assets/pages/Auth/RegisterPage.jsx';
import HomePage from "./assets/pages/HomePage.jsx";
import GroupsPage from "./assets/pages/GroupPage.jsx";
import ProductsManagePage from "./assets/pages/ProductManagePage.jsx";

const LoadingAuth = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-pulse flex space-x-2 mb-4">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-center max-w-xs">
            Проверка авторизации…
            <br />
            <span className="text-sm text-gray-400 mt-1 block">
        Это займёт всего пару секунд
      </span>
        </p>
    </div>
);

export default function App() {
    const { profile, message, isAuthChecked, login, register, logout } = useAuth();

    if (!isAuthChecked) {
        return <LoadingAuth />
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage onLogin={login} message={message} />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage onRegister={register} message={message} />}
                />
                <Route
                    path="/"
                    element={
                    profile ? (
                        <HomePage profile={profile} onLogout={logout} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
                />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/products/manage" element={<ProductsManagePage />} />
            </Routes>
        </Router>
    );
}