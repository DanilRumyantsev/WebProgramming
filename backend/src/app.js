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

app.use(
    cors({
        origin: ['http://localhost:9000', 'http://127.0.0.1:9000'],
        credentials: true,
    })
);
app.use(cookieParser());

app.get('/test', (req, res) => {
    res.send('🎉 Backend is LIVE and reloading!');
});
app.use('/api/products', productRouter);
app.use('/api/groups', groupRouter);
app.use('/api/upload', uploadRouter);

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', time: new Date().toISOString() });
});

console.log('\n🔍 Registered routes:');
app._router?.stack
    .filter(layer => layer.route)
    .forEach(layer => {
        const methods = Object.keys(layer.route.methods).join('|').toUpperCase();
        console.log(`  ${methods} ${layer.route.path}`);
    });

// Также проверим, есть ли подключённые префиксы (use-роуты)
console.log('\n📦 Mounted routers:');
app._router?.stack
    .filter(layer => layer.name === 'router' && layer.regexp)
    .forEach(layer => {
        console.log(`  ${layer.regexp} → ${layer.handle ? '✅ active' : '❌ broken'}`);
    });

sequelize
    .authenticate()
    .then(() => console.log('✅ MySQL connected'))
    .catch(err => console.error('❌ DB error:', err));

sequelize
    .sync({ alter: true })
    .then(() => console.log('✅ Tables synced'));



export default app;