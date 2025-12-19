// src/services/GroupService.js
const API = '/api';

export const ProductGroupService = {
    async getAll() {
        const res = await fetch(`${API}/groups`);
        if (!res.ok) throw new Error('Не удалось загрузить группы');
        const data = await res.json();
        return data.groups || [];
    },

    async create(name) {
        const res = await fetch(`${API}/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Ошибка создания группы');
        return res.json();
    },

    async update(id, name) {
        const res = await fetch(`${API}/groups/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error('Ошибка обновления группы');
        return res.json();
    },

    async delete(id) {
        const res = await fetch(`${API}/groups/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка удаления группы');
        return res.ok;
    },
};