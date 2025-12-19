export class ProductUpdateRequest {
    /**
     * Validate request data.
     *
     * @param data
     * @returns {{}}
     */
    static validate(data) {
        const errors = {};

        if ('name' in data && data.name != null) {
            if (typeof data.name !== 'string' || data.name.trim() === '') {
                errors.name = 'The name must be a non-empty string.';
            } else if (data.name.length > 255) {
                errors.name = 'The name must not be greater than 255 characters.';
            }
        }

        if ('price' in data && data.price != null) {
            const price = parseFloat(data.price);
            if (isNaN(price)) {
                errors.price = 'The price must be a number.';
            } else if (price < 0) {
                errors.price = 'The price must be at least 0.';
            }
        }

        if ('image' in data && data.image != null) {
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

        if ('groupId' in data && data.groupId != null) {
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

        const result = {};
        if ('name' in data) result.name = data.name ? data.name.trim() : null;
        if ('price' in data) result.price = data.price != null ? Number(parseFloat(data.price).toFixed(2)) : null;
        if ('image' in data) result.image = data.image || null;
        if ('groupId' in data) result.groupId = data.groupId != null ? Number(data.groupId) : null;
        return result;
    }
}