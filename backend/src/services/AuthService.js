import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';
import { UserRepository } from '../repositories/UserRepository.js';

export class AuthService {
    /**
     * Register user.
     *
     * @param {string} email
     * @param password
     * @returns {Promise<{token: *, user: {id: *, email: *, role: *}}>}
     */
    static async register(email, password) {
        if (!email || typeof email !== 'string') {
            throw new Error('Invalid email');
        }

        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const existing = await UserRepository.findByEmail(email);

        if (existing) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserRepository.create({
            email,
            password: hashedPassword,
        });

        // ✅ Генерируем токен — но НЕ возвращаем его
        const token = signToken({ id: user.id, email: user.email });

        // ✅ Возвращаем НЕ { token, user }, а просто данные + токен для контроллера
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token, // ← контроллер его использует для куки
        };
    }

    /**
     * Auth user.
     *
     * @param {string} email
     * @param password
     * @returns {Promise<{token: *, user: {id: number, email: string, role: string}}>}
     */
    static async login(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // ✅ Генерируем токен — но НЕ возвращаем его
        const token = signToken({ id: user.id, email: user.email });

        // ✅ Возвращаем НЕ { token, user }, а просто данные + токен для контроллера
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token, // ← контроллер его использует для куки
        };
    }

    /**
     * Get user profile.
     *
     * @param {number} userId
     * @returns {Promise<{id: *, email: *, role: *, createdAt: *}>}
     */
    static async getProfile(userId) {
        const user = await UserRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}