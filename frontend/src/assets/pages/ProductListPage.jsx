import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5001/api/products', {
                headers: {'Content-Type': 'application/json'}
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${await res.text()}`);
            }

            const data = await res.json();
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Не удалось загрузить товары');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header/>
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Загрузка товаров...</div>
                    </div>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
                    <Button as={Link} to="/products/create" variant="primary">
                        + Добавить товар
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Нет товаров</p>
                        <Button
                            as={Link}
                            to="/products/create"
                            variant="secondary"
                            className="mt-4"
                        >
                            Создать первый товар
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}