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
                />
            </main>

            <Footer/>
        </div>
    );
}