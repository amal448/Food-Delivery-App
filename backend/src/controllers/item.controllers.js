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
    // console.log("itemId", itemId);

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
    ).populate("shop", "")
    // console.log("items", item);

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
  try {
    const { city } = req.params;
    const { lat, lng } = req.query; // optional coordinates
    const maxDistance = 5 * 1000; // 5 km in meters
    let shops = [];

    // 🟢 CASE 1: If coordinates are provided, find nearby shops (within 5 km)
    if (lat && lng) {
      shops = await Shop.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: maxDistance, // ✅ correctly placed
            distanceMultiplier: 0.001, // meters → km
          },
        },
        {
          $project: {
            name: 1,
            location: 1,
            image: 1,
            address: 1,
            state: 1,
            city: 1,
            distance: { $round: ["$distance", 2] },
          },
        },
      ]);
    }

    // 🟢 CASE 2: If no coordinates are provided, search by city name
    if ((!shops || shops.length === 0) && city) {
      shops = await Shop.find({
        city: { $regex: new RegExp(`^${city}$`, "i") },
      }).populate("items");
    }

    // 🛑 If no shops found
    if (!shops || shops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shops found nearby or in this city" });
    }

    // 🟢 Extract shop IDs
    const shopIds = shops.map((shop) => shop._id);

    // 🟢 Fetch items belonging to those shops
    const items = await Item.find({ shop: { $in: shopIds } }).populate("shop");

    return res.status(200).json({
      totalShops: shops.length,
      totalItems: items.length,
      shops,
      items,
    });
  } catch (error) {
    console.error("Error in shopItemsByCity:", error);
    return res.status(500).json({
      message: "Error fetching items",
      error: error.message,
    });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query
    if (!query || !city) {
      return null
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    // 🛑 If no shops found
    if (!shops || shops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shops found nearby or in this city" });
    }
    const shopIds = shops.map(s => s._id)

    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    }).populate("shop", "name image")

    return res.status(200).json(items)
  }
  catch (error) {
    console.error("Error in searchItens:", error);
    return res.status(500).json({
      message: "Error fetching searchItens",
      error: error.message,
    });
  }
}