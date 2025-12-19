import {AuthService} from '../services/AuthService.js';

export class AuthController {
    /**
     * Register user.
     *
     * @param req
     * @param res
     * @returns {Promise<res>}
     */
    static async register(req, res) {
        try {
            const {email, password} = req.body;

            const result = await AuthService.register(email, password);

            res.status(201).json(result);
        } catch (err) {
            if (err.message === 'User already exists') {
                return res.status(409).json({message: 'User with this email already exists'});
            }

            if (err.message.includes('Password') || err.message.includes('email')) {
                return res.status(400).json({message: err.message});
            }

            console.error('[AUTH REGISTER ERROR]', err);

            res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Auth user.
     *
     * @param req
     * @param res
     * @returns {Promise<res>}
     */
    static async login(req, res) {
        try {
            const {email, password} = req.body;

            const {user, token} = await AuthService.login(email, password);

            // ✅ Кладём токен в HttpOnly-куку (контроллер знает про HTTP!)
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // true только в проде с HTTPS
                sameSite: 'lax', // или 'strict'
                domain: 'localhost', // ← ключевая строка!
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // ✅ Возвращаем ТОЛЬКО user (клиенту токен не нужен!)
            res.json({user});

            // res.json(result);
        } catch (err) {
            if (err.message === 'Invalid credentials') {
                return res.status(401).json({message: 'Invalid email or password'});
            }

            console.error('[AUTH LOGIN ERROR]', err);

            res.status(500).json({message: 'Internal server error'});
        }
    }

    static async logout(req, res) {
        // Удаляем куку
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({message: 'Logged out'});
    }

    /**
     * Get user profile.
     *
     * @param req
     * @param res
     * @returns {Promise<res>}
     */
    static async profile(req, res) {
        try {
            const profile = await AuthService.getProfile(req.user.id);

            res.json({profile});
        } catch (err) {
            console.error('[PROFILE ERROR]', err);

            res.status(404).json({message: 'User not found'});
        }
    }
}