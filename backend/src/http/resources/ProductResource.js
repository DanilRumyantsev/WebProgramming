import { ProductGroupResource } from './ProductGroupResource.js';

export class ProductResource {
    /**
     * @param {import('../../models/Product.js').default} product
     */
    constructor(product) {
        this.product = product;
    }

    /**
     * Формирует массив для JSON-ответа.
     * @returns {Object}
     */
    toArray() {
        return {
            id: this.product.id,
            name: this.product.name,
            price: parseFloat(this.product.price), // DECIMAL → number
            image: this.product.image,
            group: this.product.group ? new ProductGroupResource(this.product.group).toArray() : null,
            created_at: this.product.createdAt ? this.product.createdAt.toISOString() : null,
            updated_at: this.product.updatedAt ? this.product.updatedAt.toISOString() : null,
        };
    }

    /**
     * Для коллекций: ProductResource::collection($products)
     * @param {import('../../models/Product.js').default[]} products
     * @returns {Object[]}
     */
    static collection(products) {
        return products.map(product => new ProductResource(product).toArray());
    }

    /**
     * Response helper: new ProductResource(product).response(res)
     * @param {import('express').Response} res
     * @param {number} [status=200]
     * @returns {import('express').Response}
     */
    response(res, status = 200) {
        return res.status(status).json(this.toArray());
    }

    /**
     * Collection response
     * @param {import('express').Response} res
     * @param {import('../../models/Product.js').default[]} products
     * @returns {import('express').Response}
     */
    static collectionResponse(res, products) {
        return res.json({ data: this.collection(products) });
    }
}