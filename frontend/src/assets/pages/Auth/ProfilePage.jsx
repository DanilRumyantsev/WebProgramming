export default function ProfilePage({ profile, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-2 text-black">Привет, {profile.email}!</h2>
                <p className="text-gray-600 mb-4">Роль: {profile.role}</p>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}