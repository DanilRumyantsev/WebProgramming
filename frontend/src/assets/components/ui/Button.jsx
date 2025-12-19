// src/components/ui/Button.jsx
export default function Button({
                                   type = 'button',
                                   variant = 'primary', // 'primary', 'secondary', 'danger'
                                   size = 'md', // 'sm', 'md', 'lg'
                                   disabled,
                                   children,
                                   ...props
                               }) {
    const base = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${sizes[size]} ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            {...props}
        >
            {children}
        </button>
    );
}