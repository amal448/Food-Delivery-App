import express from 'express'
import isAuth from '../middleware/auth.middleware.js';
import { getUser,updateUserLocation } from '../controllers/user.controllers.js';

const router=express.Router()
router.get('/current',isAuth,getUser)
router.post('/update-location',isAuth,updateUserLocation)

export default router;