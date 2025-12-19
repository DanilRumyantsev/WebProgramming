// src/services/GroupService.js
export class GroupService {
    static async getAllGroups() {
        return GroupRepository.findAll();
    }

    static async createGroup(data) {
        // ✅ Уникальность проверит БД (через unique: true в миграции)
        return GroupRepository.create(data);
    }

    static async updateGroup(id, data) {
        const existing = await GroupRepository.findById(id);
        if (!existing) {
            return null;
        }
        return GroupRepository.update(id, data);
    }

    static async deleteGroup(id) {
        // 🔹 Опционально: проверить, есть ли товары в группе
        // const productCount = await ProductRepository.countByGroupId(id);
        // if (productCount > 0) {
        //   throw new Error('Cannot delete group with assigned products');
        // }

        return GroupRepository.delete(id);
    }
}