import mongoose from 'mongoose'

const shopOrderItemsSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    name: String,
    price: Number,
    quantity: Number

}, { timestamps: true })


const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subtotal: Number,
    shopOrderItems: [shopOrderItemsSchema],
    status: {
        type: String,
        enum: ["pending", "preparing", "outofdelivery", "delivered"],
        default: "pending"
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deliveryOtp: {
        type: String,
        default: null

    },
    OtpExpires: {
        type: Date
    },
    deliveredAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number
    },
    payment: {
        type: Boolean,
        default: false
    },
    razorpayOrderId: {
        type: String,
        default: false
    },
    razorpaySecretId: {
        type: String,
        default: false
    },
    razorpayPaymentId: {
        type: String,
        default: false
    },
    shopOrder: [shopOrderSchema]
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
export default Order