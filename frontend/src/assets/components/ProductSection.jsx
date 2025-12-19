import { useState, useEffect } from 'react';
import ProductCard from './ProductCard.jsx';

export default function ProductSection(
    {
        title,
        subtitle,
        products: initialProducts = [],
        fetcher,
        gridCols = 4,
        actions = null,
        showEmpty = true,
    }) {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length && !!fetcher);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (fetcher) {
            const load = async () => {
                try {
                    const data = await fetcher();
                    setProducts(data);
                } catch (err) {
                    console.error(`[ProductSection: ${title}]`, err);
                    setError(err.message || 'Не удалось загрузить товары');
                } finally {
                    setLoading(false);
                }
            };
            load();
        }
    }, [fetcher, title]);

    const getGridClass = () => {
        const cols = Math.min(Math.max(gridCols, 1), 6);
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-6`;
    };

    return (
        <section className="mb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">Загрузка...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                        Повторить
                    </button>
                </div>
            ) : (
                <>
                    <div className={getGridClass()}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id || product.name} product={product} />
                            ))
                        ) : showEmpty ? (
                            <p className="col-span-full text-center text-gray-500 py-6">Нет товаров</p>
                        ) : null}
                    </div>

                    {actions && <div className="mt-8 text-center">{actions}</div>}
                </>
            )}
        </section>
    );
}