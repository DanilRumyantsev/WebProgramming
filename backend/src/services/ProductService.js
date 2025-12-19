import {ProductRepository} from '../repositories/ProductRepository.js';
import ProductGroup from "../models/ProductGroup.js";

export class ProductService {
    /**
     * Get all products.
     *
     * @returns {Promise<Object[]>}
     */
    static async getAllProducts() {
        const products = await ProductRepository.findAll();
        return products.map(p => p.toJSON());
    }

    /**
     * Get product by ID.
     *
     * @param {number} id
     * @returns {Promise<Object>}
     */
    static async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) throw new Error('Product not found');
        return product.toJSON();
    }

    /**
     * Create a new product.
     *
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    static async createProduct(data) {
        if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
            throw new Error('Name is required and must be a non-empty string');
        }
        if (typeof data.price !== 'number' || data.price < 0) {
            throw new Error('Price must be a non-negative number');
        }

        const product = await ProductRepository.create({
            name: data.name.trim(),
            price: Number(data.price.toFixed(2)),
            image: data.image || null,
            groupId: data.groupId || null,
        });

        return product.toJSON();
    }

    /**
     * Update product by ID.
     *
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    static async updateProduct(id, data) {
        const existing = await ProductRepository.findById(id);
        if (!existing) throw new Error('Product not found');

        const updated = await ProductRepository.update(id, {
            name: data.name?.trim() || existing.name,
            price: data.price != null ? Number(Number(data.price).toFixed(2)) : existing.price,
            image: data.image !== undefined ? data.image : existing.image,
            groupId: data.groupId !== undefined ? data.groupId : existing.groupId,
        });

        if (!updated) throw new Error('Update failed');
        return updated.toJSON();
    }

    /**
     * Delete product by ID.
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    static async deleteProduct(id) {
        const deletedCount = await ProductRepository.delete(id);
        if (deletedCount === 0) throw new Error('Product not found');
    }
}