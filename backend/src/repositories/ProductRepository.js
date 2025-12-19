import Product from '../models/Product.js';

export class ProductRepository {
    /**
     * Find all products.
     *
     * @returns {Promise<Product[]>}
     */
    static async findAll() {
        return Product.findAll();
    }

    /**
     * Find product by ID.
     *
     * @param {number} id
     * @returns {Promise<Product | null>}
     */
    static async findById(id) {
        return Product.findByPk(id);
    }

    /**
     * Create a new product.
     *
     * @param {Object} data
     * @returns {Promise<Product>}
     */
    static async create(data) {
        console.log('[REPO CREATE] Input data:', JSON.stringify(data, null, 2));

        return Product.create(data);
    }

    /**
     * Update product by ID.
     *
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<Product | null>}
     */
    static async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) return null;

        await product.update(data);
        return product;
    }

    /**
     * Delete product by ID.
     *
     * @param {number} id
     * @returns {Promise<number>}
     */
    static async delete(id) {
        return Product.destroy({where: {id}});
    }
}