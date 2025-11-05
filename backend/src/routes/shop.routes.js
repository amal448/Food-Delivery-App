import express from 'express'
import { createAndEditShop, getMyShop,getNearbyShops,getShopByCity } from '../controllers/shop.controllers.js';
import isAuth from '../middleware/auth.middleware.js';
import {upload} from '../middleware/multer.middleware.js'

const router=express.Router()
router.post('/create-edit',isAuth,upload.single("image"),createAndEditShop)
router.get('/get-my',isAuth,getMyShop)
router.get('/shop-by-city/:city',isAuth,getShopByCity)
router.get('/nearby',isAuth,getNearbyShops)

export default router;