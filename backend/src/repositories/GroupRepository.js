// src/repositories/GroupRepository.js
import ProductGroup from '../models/ProductGroup.js';

export class GroupRepository {
    static async findAll() {
        return ProductGroup.findAll({
            order: [['createdAt', 'DESC']],
        });
    }

    static async findById(id) {
        return ProductGroup.findByPk(id);
    }

    static async create(data) {
        return ProductGroup.create(data);
    }

    static async update(id, data) {
        const [updatedCount, [updatedGroup]] = await ProductGroup.update(
            data,
            {
                where: { id },
                returning: true,
                validate: true,
            }
        );
        return updatedCount > 0 ? updatedGroup : null;
    }

    static async delete(id) {
        const deletedCount = await ProductGroup.destroy({
            where: { id },
        });
        return deletedCount > 0;
    }
}