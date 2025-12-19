import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function ProductCreatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        groupId: '',
    });
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/groups', {
                    headers: {'Content-Type': 'application/json'}
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setGroups(data.groups.map(g => ({
                    value: g.id,
                    label: g.name
                })));
            } catch (err) {
                console.error('Failed to load groups:', err);
            }
        };
        loadGroups();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitError(null);
        setLoading(true);

        const payload = {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            image: formData.image || null,
            groupId: formData.groupId ? Number(formData.groupId) : null,
        };

        try {
            const res = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                if (res.status === 422) {
                    const errorData = await res.json().catch(() => ({}));
                    setErrors(errorData.errors || {});
                } else {
                    const errorText = await res.text().catch(() => '');
                    setSubmitError(`Ошибка ${res.status}: ${errorText || 'неизвестная'}`);
                }
                return;
            }

            const product = await res.json();
            navigate('/products', {
                state: {success: `Товар "${product.name}" создан`}
            });

        } catch (err) {
            console.error('Network error:', err);
            setSubmitError('Не удалось подключиться к серверу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header/>
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <button
                        type="button"
                        onClick={() => navigate('/products')}
                        className="inline-block mb-4 text-blue-600 hover:text-blue-800"
                    >
                        ← Назад к списку товаров
                    </button>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">
                            Создание товара
                        </h1>

                        {submitError && <Alert variant="error">{submitError}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Название товара"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                placeholder="Например: Ноутбук Dell XPS"
                                required
                            />

                            <Input
                                label="Цена (₽)"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                error={errors.price}
                                placeholder="0.00"
                                required
                            />

                            <Input
                                label="Изображение (URL)"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                error={errors.image}
                                placeholder="https://example.com/image.jpg"
                            />

                            <Select
                                label="Группа"
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleChange}
                                options={groups}
                                error={errors.groupId}
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/products')}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Создание...' : 'Создать товар'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}