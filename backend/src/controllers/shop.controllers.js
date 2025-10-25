import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createAndEditShop = async (req, res) => {
    try {

        const { shopId, name, city, state, address } = req.body;
        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop;

        // CASE 1: Editing an existing shop
        if (shopId) {
            shop = await Shop.findOneAndUpdate(
                { _id: shopId, owner: req.userId }, // ensures only their own shop
                { name, city, state, address, image },
                { new: true }
            );

            if (!shop) {
                return res.status(404).json({ message: "Shop not found or not yours" });
            }
        }
        // CASE 2: Creating a new shop
        else {
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId,
            });
        }

        await shop.populate("owner");
        return res.status(201).json(shop);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating/updating shop" });
    }
}
export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.find({ owner: req.userId }).populate("owner items")
        if (!shop) {
            return null
        }
        return res.status(200).json(shop)
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error in fetching shop" });
    }
}
export const getShopByCity = async (req, res) => {
    const city = req.params.city
    try {

        const shops = await Shop.find(
            { city: { $regex: new RegExp(`^${city}$`, "i") } }
        )

        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }

        return res.status(201).json(shops)
    }
    catch (error) {
        return res.status(500).json({ message: "get shops error", error })
    }
}

