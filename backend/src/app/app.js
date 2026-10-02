import express from'express';
import cookieParser from 'cookie-parser'
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cartRoutes from '../routes/cart.route.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

export default app;