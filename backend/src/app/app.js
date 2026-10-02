import express from'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import config from '../configs/env.config.js';
import authRoutes from '../routes/auth.route.js';
import productRoutes from '../routes/product.route.js';
import cartRoutes from '../routes/cart.route.js';


const app = express();

app.use(cors({
	origin(origin, callback) {
		if (!origin || config.FRONTEND_ORIGINS.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Origin not allowed by CORS"));
	},
	credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

export default app;