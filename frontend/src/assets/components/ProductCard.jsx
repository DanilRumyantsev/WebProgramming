export default function ProductCard({product}) {
    return (
        <div
            className="bg-white rounded-lg shadow-sm max-w-sm overflow-hidden flex flex-col h-full transition-transform hover:shadow-md">
            <div className="flex-shrink-0 h-100 overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm text-center px-2">
              Нет изображения
            </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                </h3>

                {product.group && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mb-2">
            {product.group.name}
          </span>
                )}

                <div className="mt-auto">
                    <p className="text-xl font-bold text-gray-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </p>
                </div>
            </div>

            <div className="px-4 pb-4 mt-auto">
                <button className="w-full py-2.5 bg-black text-white rounded-md hover:bg-stone-800 transition">
                    В корзину
                </button>
            </div>
        </div>
    );
}