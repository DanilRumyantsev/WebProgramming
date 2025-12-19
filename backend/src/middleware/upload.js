// src/middleware/upload.js
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(), // ← обязательно!
    limits: {fileSize: 10 * 1024 * 1024}, // 10MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpeg|png|webp|gif)/)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    },
});

export const uploadImage = upload.single('image');