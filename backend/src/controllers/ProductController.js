// src/controllers/ProductController.js
import { ProductStoreRequest } from '../http/requests/ProductStoreRequest.js';
import { ProductUpdateRequest } from '../http/requests/ProductUpdateRequest.js';
import { ProductResource } from '../http/resources/ProductResource.js';
import { ProductService } from '../services/ProductService.js';

export class ProductController {
    static async getAll(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            return ProductResource.collectionResponse(res, products);
        } catch (err) {
            console.error('[PRODUCT GET ALL ERROR]', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(Number(id));
            return new ProductResource(product).response(res);
        } catch (err) {
            if (err.message === 'Product not found') {
                return res.status(404).json({ message: 'Product not found' });
            }
            console.error('[PRODUCT GET BY ID ERROR]', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 🔹 create — без валидации внутри!
    static async create(req, res) {
        try {
            // ✅ Валидация вынесена — как middleware в Laravel
            const validated = ProductStoreRequest.validate(req.body);

            const product = await ProductService.createProduct(validated);
            return new ProductResource(product).response(res, 201);
        } catch (err) {
            // ✅ Обработка ошибок валидации — единообразно
            if (err.status === 422) {
                return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: err.errors,
                });
            }
            console.error('[PRODUCT CREATE ERROR]', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const validated = ProductUpdateRequest.validate(req.body);

            const product = await ProductService.updateProduct(Number(id), validated);
            return new ProductResource(product).response(res);
        } catch (err) {
            if (err.status === 422) {
                return res.status(422).json({
                    message: 'The given data was invalid.',
                    errors: err.errors,
                });
            }
            if (err.message === 'Product not found') {
                return res.status(404).json({ message: 'Product not found' });
            }
            console.error('[PRODUCT UPDATE ERROR]', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await ProductService.deleteProduct(Number(id));
            return res.status(204).send();
        } catch (err) {
            if (err.message === 'Product not found') {
                return res.status(404).json({ message: 'Product not found' });
            }
            console.error('[PRODUCT DELETE ERROR]', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}