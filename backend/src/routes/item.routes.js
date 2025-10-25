import express from 'express'
import isAuth from '../middleware/auth.middleware.js';
import { addItem,editItem,getItems,shopItemsByCity } from '../controllers/item.controllers.js';
import {upload} from '../middleware/multer.middleware.js'

const router=express.Router()
router.post('/add-item',isAuth,upload.single("image"),addItem)
router.post('/edit-item/:itemId',isAuth,upload.single("image"),editItem)
router.get('/get-items/:shopId',isAuth,getItems)
router.get('/shop-items/:city',isAuth,shopItemsByCity)
export default router;