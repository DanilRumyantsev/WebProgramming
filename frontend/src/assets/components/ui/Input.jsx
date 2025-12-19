// src/components/ui/Input.jsx
export default function Input({ label, error, ...props }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}