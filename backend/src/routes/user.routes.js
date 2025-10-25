import express from 'express'
import isAuth from '../middleware/auth.middleware.js';
import { getUser } from '../controllers/user.controllers.js';

const router=express.Router()
router.get('/current',isAuth,getUser)

export default router;