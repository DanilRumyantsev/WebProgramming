import User from '../models/User.js';

export class UserRepository {
    /**
     * Find user by email.
     * @param {string} email
     * @returns {Promise<User | null>}
     */
    static async findByEmail(email) {
        return User.findOne({ where: { email } });
    }

    /**
     * Find user by ID.
     * @param {number} id
     * @returns {Promise<User | null>}
     */
    static async findById(id) {
        return User.findByPk(id);
    }

    /**
     * Create a new user.
     * @param {Object} data
     * @param {string} data.email
     * @param {string} data.password
     * @param {string} [data.role='user']
     * @returns {Promise<User>}
     */
    static async create(data) {
        return User.create(data);
    }

    /**
     * Update user by ID.
     * @param {number} id
     * @param {Object} data
     * @returns {Promise<User | null>}
     */
    static async update(id, data) {
        const [updatedCount, updatedUsers] = await User.update(data, {
            where: { id },
            returning: true,
        });
        return updatedCount > 0 ? updatedUsers[0] : null;
    }

    /**
     * Delete user by ID.
     * @param {number} id
     * @returns {Promise<number>}
     */
    static async delete(id) {
        return User.destroy({ where: { id } });
    }
}