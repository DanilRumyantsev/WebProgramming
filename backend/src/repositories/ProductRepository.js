// src/repositories/ProductRepository.js
import Product from '../models/Product.js';

/**
 * Repository for Product model operations.
 */
export class ProductRepository {
    /**
     * Find all products.
     * @returns {Promise<Product[]>}
     */
    static async findAll() {
        return Product.findAll();
    }

    /**
     * Find product by ID.
     * @param {number} id
     * @returns {Promise<Product | null>}
     */
    static async findById(id) {
        return Product.findByPk(id);
    }

    /**
     * Create a new product.
     * @param {Object} data
     * @param {string} data.name
     * @param {number} data.price
     * @param {string|null} [data.image]
     * @param {string|null} [data.group]
     * @returns {Promise<Product>}
     */
    static async create(data) {
        return Product.create(data);
    }

    /**
     * Update product by ID.
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Product | null>}
     */
    static async update(id, data) {
        const [updatedCount, updatedProducts] = await Product.update(data, {
            where: { id },
            returning: true,
        });
        return updatedCount > 0 ? updatedProducts[0] : null;
    }

    /**
     * Delete product by ID.
     * @param {number} id
     * @returns {Promise<number>}
     */
    static async delete(id) {
        return Product.destroy({ where: { id } });
    }
}