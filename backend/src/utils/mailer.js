import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.NODEMAILER_EMAIL, process.env.NODEMAILER_PASS);
//host
const transporter = nodemailer.createTransport({
    
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    },
});
// message to client 
export const sendMail = async (email,otp) => {
    console.log(email,otp);
    
    const info = await transporter.sendMail({
        from: "Food Delivery App",
        to: email,
        subject: "Otp Verificatoon",
        text: otp, // plain‑text body
        html: "<b>Hello world?</b>", // HTML body
    });

}
// message to client 
export const sendDeliveryOtpMail = async (to,otp) => {
    console.log(to,otp);
    
    await transporter.sendMail({
        from: "Food Delivery App",
        // to,
        to:"amalthomas333444@gmail.com",
        subject: "Delivery Otp",
        text: otp, // plain‑text body
        html: `Your OTP for delivery is <b>${otp}</b>`, // HTML body
    });

}



// export default sendMail;