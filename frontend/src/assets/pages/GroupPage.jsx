// src/pages/GroupsPage.jsx
import { useState, useEffect } from 'react';
import { ProductGroupService } from '@/services/ProductGroupService.js';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ id: null, name: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadGroups = async () => {
        try {
            const data = await ProductGroupService.getAll();
            setGroups(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadGroups(); }, []);

    const openModal = (group = null) => {
        setForm(group ? { id: group.id, name: group.name } : { id: null, name: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await ProductGroupService.update(form.id, form.name);
            } else {
                await ProductGroupService.create(form.name);
            }
            await loadGroups();
            setIsModalOpen(false);
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Удалить группу "${name}"? Это повлияет на все товары в ней.`)) return;
        try {
            await ProductGroupService.delete(id);
            await loadGroups();
        } catch (err) {
            alert('Ошибка удаления: ' + err.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Управление группами</h1>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    + Добавить группу
                </button>
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p className="text-red-600">❌ {error}</p>
            ) : groups.length === 0 ? (
                <p className="text-gray-500">Нет групп</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left">ID</th>
                            <th className="py-2 px-4 text-left">Название</th>
                            <th className="py-2 px-4 text-left">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groups.map((group) => (
                            <tr key={group.id} className="border-t hover:bg-gray-50">
                                <td className="py-2 px-4">{group.id}</td>
                                <td className="py-2 px-4 font-medium">{group.name}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => openModal(group)}
                                        className="text-blue-600 hover:underline mr-3"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(group.id, group.name)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {form.id ? 'Редактировать группу' : 'Создать группу'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Название</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Обувь, Майки..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {form.id ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}