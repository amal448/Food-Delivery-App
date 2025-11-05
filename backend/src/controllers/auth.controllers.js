import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import genToken from "../utils/token.js"
import { sendMail } from "../utils/mailer.js"

export const signUp = async (req, res) => {
    const { fullName, email, password, mobile, role } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "User Already Exist!!" })

        if (password.length < 4) return res.status(400).json({ message: "Password must be at least 6 characters!!" })
        if (mobile.length < 10) return res.status(400).json({ message: "Mobile must be at least 10 digits!!" })

        const hashedPassword = await bcrypt.hash(password, 10)
        const newuser = await User.create({
            fullName, email, role, mobile, password: hashedPassword
        })
        const token = await genToken(newuser._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only when deployed (Render uses HTTPS)
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" allows cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(newuser)
    }
    catch (error) {
        console.log(error);

        return res.status(500).json(`sign up error ${error}`)
    }

}
export const signIn = async (req, res) => {
    let { email, password, role } = req.body;

    role = role && role.trim() ? role : "user";

    // console.log("signIn", req.body);
    try {
        const user = await User.findOne({ email })
        // console.log("user", user);

        if (!user) return res.status(400).json({ message: "User does not Exist!!" })
        if (user.role != role) return res.status(400).json({ message: "UnAuthorised Request!!" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials!!" })

        const token = await genToken(user._id)
        // res.cookie("token", token, {
        //     secure: false,
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        //     httpOnly: true
        // })
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only when deployed (Render uses HTTPS)
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" allows cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(user)
    }
    catch (error) {
        return res.status(500).json(`sign In error ${error}`)
    }

}
export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "log out successfully" })
    }
    catch (error) {
        return res.status(500).json(`signed Out error ${error}`)

    }
}

export const sendOtp = async (req, res) => {
    try {

        const { email } = req.body
        console.log(email);

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User does not Exist!!" })

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp = otp;
        user.OtpExpires = Date.now() + 5 * 60 * 1000
        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({ message: "Otp has send to your Mail Account", success: true })

    }
    catch (error) {
        return res.status(500).json(`sendOtp error ${error}`)
    }
}
export const verifyOtp = async (req, res) => {
    try {

        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.OtpExpires < Date.now()) return res.status(400).json({ message: "Invalid Expired Otp!!" })

        user.isVerified = true;
        user.resetOtp = undefined
        user.OtpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "Otp Verified Successfully", success: true })

    }
    catch (error) {
        return res.status(500).json(`verifyOtp error ${error}`)
    }
}

export const resetOtp = async (req, res) => {
    try {

        const { email, newpassword } = req.body;
        console.log(req.body);

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User does not Exist!!" })
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        user.password = hashedPassword
        user.save()
        return res.status(200).json({ message: "Password Updated Successfully" })

    }
    catch (error) {
        return res.status(500).json(`resetOtp error ${error}`)
    }

}

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email } = req.body
        console.log(fullName, email);

        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                fullName,
                email,
                authProvider: "google",
                isVerified: true,
            });
        }
        console.log("user", user);

        const token = await genToken(user?._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json(user)
    }
    catch (error) {
        console.log(error.message);

        return res.status(500).json(`Google Auth error ${error}`)
    }
}












