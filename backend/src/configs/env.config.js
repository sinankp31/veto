import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_ORIGINS: (process.env.FRONTEND_ORIGINS || "http://localhost:5173").split(",").map(origin => origin.trim()).filter(Boolean)
}

export default config;