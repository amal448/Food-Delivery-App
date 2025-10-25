import express from 'express'
import { placeOrder } from '../controllers/order.controllers.js';
import isAuth from '../middleware/auth.middleware.js';

const router=express.Router()
router.post('/place-order',isAuth,placeOrder)

export default router;