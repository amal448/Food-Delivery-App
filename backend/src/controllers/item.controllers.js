import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" })
        }
        const item = await Item.create({
            name, category, foodType, price, image, shop: shop._id
        })
        return res.status(201).json(item)
    }
    catch (error) {
        return res.status(500).json({ message: "add item error", error })
    }
}

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        console.log("itemId", itemId);

        const { name, category, foodType, price } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const item = await Item.findByIdAndUpdate(
            itemId, { name, category, foodType, price, image },
            { new: true }
        )
        if (!item) {
            return res.status(400).json({ message: "item not found" })

        }
        return res.status(201).json(item)
    }
    catch (error) {
        return res.status(500).json({ message: "add item error", error })
    }
}
export const getItems = async (req, res) => {
    const shopId = req.params.shopId
    try {

        const item = await Item.find(
            { shop: shopId }
        )
        console.log("items", item);

        if (!item) {
            return res.status(400).json({ message: "items not found" })

        }
        // console.log("itemsList",item);

        return res.status(201).json(item)
    }
    catch (error) {
        return res.status(500).json({ message: "get item error", error })
    }
}
export const shopItemsByCity = async (req, res) => {
    const city = req.params.city
    console.log(city);
    
    try {

        const shops = await Shop.find(
            { city: { $regex: new RegExp(`^${city}$`, "i") } }
        ).populate('items')
        console.log("shops",shops);
        
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopId=shops.map((shop)=>shop._id)
        console.log("shopId",shopId);

        const items=await Item.find({shop:{$in:shopId}}).populate('shop')
        console.log("itemsList",items);

        return res.status(201).json(items)
    }
    catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: "get item error", error })
    }
}