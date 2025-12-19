import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import sequelize from './config/database.js';
import productRouter from './routes/product.js';
import groupRouter from './routes/group.js';
import uploadRouter from './routes/upload.js';

const app = express();

/**
 * CORS.
 */
app.use(
    cors({
        origin: ['http://localhost:9000', 'http://127.0.0.1:9000'],
        credentials: true,
    })
);

/**
 * Utilities.
 */
app.use(cookieParser());
app.use(express.json({limit: '10mb'}));
app.use(helmet());
app.use(morgan('dev'));

/**
 * Use routes.
 */
app.use('/api/products', productRouter);
app.use('/api/groups', groupRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
    res.json({status: 'OK', time: new Date().toISOString()});
});

/**
 * Ping database.
 */
sequelize
    .authenticate()
    .then(() => console.log('MySQL connected'))
    .catch(err => console.error('DB error:', err));

sequelize
    .sync({alter: true})
    .then(() => console.log('Tables synced'));


export default app;