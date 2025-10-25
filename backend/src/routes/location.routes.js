import express from 'express'
// import isAuth from '../middleware/auth.middleware.js';
import { FetchLocation } from '../controllers/location.controllers.js';
const router=express.Router()

router.post('/reverse-geocode',FetchLocation)

export default router;