// src/components/ProductCard.jsx
export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">Нет изображения</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>

                {product.group && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mb-2">
            {product.group.name}
          </span>
                )}

                <p className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString('ru-RU')} ₽
                </p>
            </div>

            <div className="px-4 pb-4">
                <button className="w-full py-2 bg-black text-white rounded-md hover:bg-stone-700 transition cursor-pointer">
                    В корзину
                </button>
            </div>
        </div>
    );
}