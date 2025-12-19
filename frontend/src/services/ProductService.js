// src/services/ProductService.js
const API_BASE = '/api'; // проксируется в vite.config.js → localhost:5001

export const ProductService = {
    async getAll() {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        return data.data || data; // т.к. бэкенд отдаёт { data: [...] }
    },

    async getById(id) {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('Товар не найден');
            throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        return data.data || data;
    },

    async create(productData) {
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        if (!res.ok) {
            let message = 'Ошибка создания товара';
            try {
                const err = await res.json();
                message = err.message || err.errors?.name?.[0] || err.errors?.price?.[0] || message;
            } catch {}
            throw new Error(message);
        }
        return res.json();
    },

    async update(id, productData) {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        if (!res.ok) {
            let message = 'Ошибка обновления товара';
            try {
                const err = await res.json();
                message = err.message || Object.values(err.errors || {})[0]?.[0] || message;
            } catch {}
            throw new Error(message);
        }
        return res.json();
    },

    async delete(id) {
        const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            if (res.status === 404) throw new Error('Товар не найден');
            throw new Error(`HTTP ${res.status}: Не удалось удалить`);
        }
        return true;
    },
};