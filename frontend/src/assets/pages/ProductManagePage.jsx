// src/pages/ProductsManagePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '@/services/ProductService.js';
import Header from '@/assets/components/layout/Header.jsx';
import Footer from '@/assets/components/layout/Footer.jsx';
import ProductModal from '@/assets/components/modals/ProductModal.jsx';

export default function ProductsManagePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = useCallback(async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (err) {
            alert('Ошибка загрузки товаров: ' + err.message);
        }
    }, []);

    useEffect(() => {
        loadProducts().finally(() => setLoading(false));
    }, [loadProducts]);

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data, id) => {
        try {
            if (id) {
                await ProductService.update(id, data);
            } else {
                await ProductService.create(data);
            }
            await loadProducts();
        } catch (err) {
            alert('Ошибка сохранения: ' + err.message);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Удалить товар "${name}"?`)) return;
        try {
            await ProductService.delete(id);
            await loadProducts();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Управление товарами</h1>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        + Добавить товар
                    </button>
                </div>

                {loading ? (
                    <p className="text-center py-10 text-gray-500">Загрузка...</p>
                ) : products.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">Нет товаров</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300x200?text=–'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Broken')}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                    <p className="mt-1 text-lg font-bold text-blue-600">
                                        {new Intl.NumberFormat('ru-RU', {
                                            style: 'currency',
                                            currency: 'RUB',
                                            minimumFractionDigits: 0,
                                        }).format(product.price)}
                                    </p>
                                    {product.group && (
                                        <p className="mt-2 text-sm text-gray-600">Группа: {product.group.name}</p>
                                    )}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Подключаем модалку */}
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    initialData={editingProduct}
                />
            </main>
            <Footer />
        </div>
    );
}