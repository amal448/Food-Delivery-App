import mongoose from "mongoose";
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    deliveryRadius: { type: Number, default: 5 }, // km
    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    }
}, { timestamps: true })
shopSchema.index({ location: "2dsphere" });
const Shop = mongoose.model('Shop', shopSchema)
export default Shop;