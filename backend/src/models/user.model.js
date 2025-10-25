import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
    },
    isMobileVerified: { type: Boolean, default: false },

    role: {
        type: String,
        enum: ["user", "owner", "deliveryBoy"],
        required: true,
        default: 'user'
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    resetOtp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    OtpExpires: {
        type: String
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User