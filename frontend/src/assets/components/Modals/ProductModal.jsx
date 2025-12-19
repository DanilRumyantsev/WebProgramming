import {useState, useEffect, useRef, useCallback} from 'react';
import {ProductGroupService} from '@/services/ProductGroupService.js';

export default function ProductModal({isOpen, onClose, onSubmit, initialData = null}) {
    const [form, setForm] = useState({
        id: null,
        name: '',
        price: '',
        image: '',
        groupId: '',
    });
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [uploading, setUploading] = useState(false);

    const dropRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const initModal = async () => {
            let groupsArray = [];
            try {
                const response = await ProductGroupService.getAll();
                groupsArray = Array.isArray(response?.groups) ? response.groups : [];
                setGroups(groupsArray);
            } catch (err) {
                console.error('Ошибка загрузки групп:', err);
                alert('Не удалось загрузить список групп');
                groupsArray = [];
                setGroups([]);
            } finally {
                setLoadingGroups(false);
            }

            if (initialData) {
                setForm({
                    id: initialData.id ?? null,
                    name: initialData.name || '',
                    price: String(initialData.price || ''),
                    image: initialData.image || '',
                    groupId: initialData.group?.id ? String(initialData.group.id) : '',
                });
            } else {
                setForm({id: null, name: '', price: '', image: '', groupId: ''});
            }
            console.log('Product for edit:', product);
        };

        initModal();
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const uploadImageToMinIO = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение (JPEG, PNG, WebP, GIF)');
            return null;
        }

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message || 'Ошибка загрузки');
            }

            return result.url;
        } catch (err) {
            console.error('Upload error:', err);
            alert(`Не удалось загрузить изображение: ${err.message}`);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await uploadImageToMinIO(file);
            if (url) setForm((prev) => ({...prev, image: url}));
        }
    };

    const handlePaste = useCallback(
        (e) => {
            if (!isOpen) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault();
                        uploadImageToMinIO(file).then((url) => {
                            if (url) setForm((prev) => ({...prev, image: url}));
                        });
                        break;
                    }
                }
            }
        },
        [isOpen]
    );

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            uploadImageToMinIO(file).then((url) => {
                if (url) setForm((prev) => ({...prev, image: url}));
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('paste', handlePaste);
        }
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [isOpen, handlePaste]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: form.name.trim(),
            price: parseFloat(form.price),
            image: form.image ? form.image.trim().replace(/^"(.*)"$/, '$1') : null,
            groupId: form.groupId ? parseInt(form.groupId, 10) : null,
        };

        if (!payload.name) {
            alert('Название товара обязательно');
            return;
        }
        if (isNaN(payload.price) || payload.price < 0) {
            alert('Цена должна быть числом ≥ 0');
            return;
        }

        onSubmit(payload, form.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md mx-4">
                <div
                    className="bg-white rounded-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto transform transition-all duration-200 scale-100">
                    <h2 className="text-xl font-bold mb-4">
                        {form.id ? 'Редактировать товар' : 'Добавить товар'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Название *</label>
                            <input
                                name="name"
                                type="text"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Например: Беспроводные наушники"
                                disabled={uploading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Цена (₽) *</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={form.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                                disabled={uploading}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">
                                Изображение (вставьте, перетащите или загрузите)
                            </label>

                            {form.image && (
                                <div className="mb-3">
                                    <img
                                        src={form.image}
                                        alt="Превью"
                                        className="w-24 h-24 object-cover rounded border"
                                        onError={(e) => (e.target.style.display = 'none')}
                                    />
                                </div>
                            )}

                            <div
                                ref={dropRef}
                                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors min-h-[120px]
                                    ${isDragging ? 'border-black bg-blue-50' : 'border-gray-300 hover:border-stone-400'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-gray-400 mb-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                                <p className="text-sm text-gray-500 text-center">
                                    Перетащите изображение,<br/>
                                    нажмите для выбора,<br/>
                                    или вставьте (<kbd>Ctrl+V</kbd>)
                                </p>
                                {uploading && (
                                    <p className="text-xs text-black mt-1">Загрузка...</p>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            <div className="mt-2">
                                <input
                                    name="image"
                                    type="url"
                                    value={form.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none text-sm"
                                    disabled={uploading}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Или введите URL вручную
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-1">Группа</label>
                            {loadingGroups ? (
                                <p className="text-sm text-gray-500">Загрузка групп...</p>
                            ) : (
                                <select
                                    name="groupId"
                                    value={form.groupId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none cursor-pointer"
                                    disabled={uploading}
                                >
                                    <option value="">— Без группы —</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                                disabled={uploading}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-stone-700 focus:ring-2 focus:ring-black focus:outline-none disabled:opacity-70"
                                disabled={uploading}
                            >
                                {form.id ? 'Сохранить' : 'Создать'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}