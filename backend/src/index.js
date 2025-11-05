import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js'
import shopRouter from './routes/shop.routes.js'
import itemRouter from './routes/item.routes.js'
import orderRouter from './routes/order.routes.js'
import locationRouter from './routes/location.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(express.json())

const allowedOrigins = [
    "https://food-delivery-app-pi-opal.vercel.app",
    "http://localhost:5173"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/shop', shopRouter)
app.use('/api/order', orderRouter)
app.use('/api/item', itemRouter)
app.use('/api/location', locationRouter)


const port = process.env.PORT || 5000
app.listen(port, () => {
    connectDb()
    console.log(`server started at ${port}`);
})