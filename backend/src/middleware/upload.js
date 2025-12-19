// src/middleware/uploadImage.js
import multer from 'multer';

// Храним файл в памяти (буфер), чтобы передать в MinIO
const storage = multer.memoryStorage();

// Ограничения и фильтрация
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Создаём middleware для одного поля 'file'
export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 МБ
    },
    fileFilter,
}).single('file'); // ← важно: ожидаем поле с именем 'file'