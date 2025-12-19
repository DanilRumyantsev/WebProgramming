// src/middleware/auth.js

import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req, res, next) => {
    console.log('\n=== AUTH MIDDLEWARE DEBUG ===');
    console.log('🔹 req.cookies:', req.cookies);
    console.log('🔹 Authorization header:', req.headers.authorization);
    console.log('🔹 URL:', req.url);
    console.log('🔹 Method:', req.method);
    console.log('=============================\n');
    let token = null;

    // 1. Заголовок Authorization: Bearer (для Postman, мобильных клиентов)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Кука 'token' (для браузера)
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Token required' });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = payload;
    next();
};