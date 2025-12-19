import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import ProductSection from '../components/ProductSection.jsx';
import {axiosInstance} from "@/api/axiosInstance.js";

const fetchPopularProducts = async () => {
    try {
        const res = await axiosInstance.get('/products');
        return res.data.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Не удалось загрузить товары';
        throw new Error(msg);
    }
};

const saleProducts = [
    {id: 101, name: 'Наушники со скидкой', price: 2490, image: 'https://picsum.photos/300/200?random=11'},
    {id: 102, name: 'Клавиатура -30%', price: 3990, image: 'https://picsum.photos/300/200?random=12'},
];

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header/>

            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                    Добро пожаловать в наш магазин!
                </h1>

                <ProductSection
                    title="Все товары"
                    subtitle="Последние поступления"
                    fetcher={fetchPopularProducts}
                    gridCols={4}
                    actions={
                        <>
                            <a
                                href="/products"
                                className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-stone-700"
                            >
                                Перейти к товарам
                            </a>
                        </>
                    }
                />

                <ProductSection
                    title="🔥 Горячие акции"
                    subtitle="Только сегодня — скидки до 50%!"
                    products={saleProducts}
                    gridCols={2}
                    showEmpty={false}
                />
            </main>

            <Footer/>
        </div>
    );
}