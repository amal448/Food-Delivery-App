import express from 'express'
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp, verifyPayment } from '../controllers/order.controllers.js';
import isAuth from '../middleware/auth.middleware.js';

const router = express.Router()
router.post('/place-order', isAuth, placeOrder)
router.post('/verify-payment', isAuth, verifyPayment)
router.get('/my-orders', isAuth, getMyOrders)
router.get('/get-assignments', isAuth, getDeliveryBoyAssignment)
router.get('/get-current-order', isAuth, getCurrentOrder)
router.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
router.get('/accept-order/:assignmentId', isAuth, acceptOrder)
router.get('/get-order-by-id/:orderId', isAuth, getOrderById)
router.post('/send-delivery-otp', isAuth, sendDeliveryOtp)
router.post('/verify-delivery-otp', isAuth, verifyDeliveryOtp)

export default router;