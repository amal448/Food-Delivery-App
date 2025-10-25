import express from 'express'
import { signIn,signOut,signUp,sendOtp,verifyOtp,resetOtp, googleAuth } from '../controllers/auth.controllers.js'

const router=express.Router()
router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/signout',signOut)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',verifyOtp)
router.post('/reset-password',resetOtp)
router.post('/google-sign',googleAuth)
export default router;