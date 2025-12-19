export class ProductStoreRequest {
    /**
     * Валидация данных. Вызывается до контроллера.
     * @param {Object} data — req.body
     * @throws {Error} если валидация не пройдена
     */
    static validate(data) {
        const errors = {};

        // name: required|string|max:255
        if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
            errors.name = 'The name field is required.';
        } else if (data.name.length > 255) {
            errors.name = 'The name must not be greater than 255 characters.';
        }

        // price: required|numeric|min:0
        const price = parseFloat(data.price);
        if (isNaN(price) || data.price == null) {
            errors.price = 'The price field is required.';
        } else if (price < 0) {
            errors.price = 'The price must be at least 0.';
        }

        // image: nullable|url
        if (data.image != null) {
            if (typeof data.image !== 'string') {
                errors.image = 'The image must be a URL.';
            } else {
                try {
                    new URL(data.image);
                } catch {
                    errors.image = 'The image format is invalid.';
                }
            }
        }

        // groupId: nullable|exists:product_groups,id
        if (data.groupId != null) {
            const id = Number(data.groupId);
            if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
                errors.groupId = 'The selected group is invalid.';
            }
            // 💡 Проверку exists сделаем в сервисе (там доступ к БД)
        }

        if (Object.keys(errors).length > 0) {
            const error = new Error('Validation failed');
            error.status = 422;
            error.errors = errors;
            throw error;
        }

        // ✅ Возвращаем **очищенные и приведённые данные**
        return {
            name: data.name.trim(),
            price: Number(price.toFixed(2)),
            image: data.image || null,
            groupId: data.groupId ? Number(data.groupId) : null,
        };
    }
}