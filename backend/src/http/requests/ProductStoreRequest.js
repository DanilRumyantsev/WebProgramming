export class ProductStoreRequest {
    /**
     * Validate request data.
     *
     * @param {Object} data
     * @throws {Error}
     */
    static validate(data) {
        const errors = {};

        if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
            errors.name = 'The name field is required.';
        } else if (data.name.length > 255) {
            errors.name = 'The name must not be greater than 255 characters.';
        }

        const price = parseFloat(data.price);
        if (isNaN(price) || data.price == null) {
            errors.price = 'The price field is required.';
        } else if (price < 0) {
            errors.price = 'The price must be at least 0.';
        }

        if (data.image != null) {
            if (typeof data.image !== 'string') {
                errors.image = 'The image must be a URL.';
            } else {
                if (typeof data.image === 'string') {
                    const isAbsoluteUrl = /^https?:\/\//i.test(data.image);
                    const isRelativePath = /^\/[^\s]*$/i.test(data.image);

                    if (!isAbsoluteUrl && !isRelativePath) {
                        errors.image = 'The image must be a valid URL or path.';
                    }
                } else {
                    errors.image = 'The image must be a string.';
                }
            }
        }

        if (data.groupId != null) {
            const id = Number(data.groupId);
            if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
                errors.groupId = 'The selected group is invalid.';
            }
        }

        if (Object.keys(errors).length > 0) {
            const error = new Error('Validation failed');
            error.status = 422;
            error.errors = errors;
            throw error;
        }

        return {
            name: data.name.trim(),
            price: Number(price.toFixed(2)),
            image: data.image || null,
            groupId: data.groupId ? Number(data.groupId) : null,
        };
    }
}