import Shop from "../models/shop.model.js"
import Order from "../models/order.model.js";
import User from '../models/user.model.js'
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { sendDeliveryOtpMail } from "../utils/mailer.js";
import Razorpay from 'razorpay';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
console.log("placeOrder",req.body);

    try {
        const { cartItems, deliveryAddress, totalAmount,paymentMode } = req.body

        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({ message: "cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "send complete deliveryAddress" })
        }
        const groupItemsByShop = {}
        // {
        //    shopId1: [item1,item2]
        //    shopId2: [item1]
        // }
        cartItems.forEach(item => {
            const shopId = item?.shop?._id || item?.shop
            console.log("item?.shop?._id || item?.shop", item?.shop?._id || item?.shop);

            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map
            (async (shopId) => {
                //process of a storing details of single shop
                const shop = await Shop.findById(shopId).populate("owner");
                if (!shop) {
                    return res.status(400).json({ message: "shop not found" });
                }

                if (!shop.owner) {
                    return res.status(400).json({ message: "shop owner not found" });
                }

                const items = groupItemsByShop[shopId];
                const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

                return {
                    shop: shop._id,
                    owner: shop.owner._id, // safe now
                    subtotal,
                    shopOrderItems: items.map((i) => ({
                        item: i.id,
                        price: i.price,
                        quantity: i.quantity,
                        name: i.name,
                    })),
                };

            }))


        if (paymentMode == "online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(totalAmount * 100), // Amount in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            });


            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod: req.body.paymentMode,
                deliveryAddress,
                totalAmount,
                shopOrder: shopOrders,
                razorpayOrderId: razorOrder.id,
                payment: false
            })

            return res.status(200).json({
                razorOrder,
                orderId: newOrder._id,
                key_id: process.env.RAZORPAY_KEY_ID
            })

        }

        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod: req.body.paymentMode,
            deliveryAddress,
            totalAmount,
            shopOrder: shopOrders
        })
        await newOrder.populate("shopOrder.shopOrderItems.item", "name image price")

        return res.status(201).json(newOrder)
    }
    catch (error) {
        return res.status(500).json({ message: `place order error ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if (!payment || payment.status != "captured") {
            return res.status(400).json({ message: "payment not captured" })
        }
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        order.payment = true //verified
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await order.populate("shopOrder.shopOrderItems.item", "name image price")
        await order.populate("shopOrder.shop", "name")
        return res.status(200).json(order)
       
    }
    catch (error) {
          console.error("verifyPayment error", error);
        return res.status(500).json({ message: "verifyPayment Error" });
    }
}



export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrder.shop", "name")
                .populate("shopOrder.owner", "name email mobile")
                .populate("shopOrder.shopOrderItems.item", "name image price")

            return res.status(200).json(orders)
        }
        else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrder.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrder.shop", "name")
                .populate("user")
                .populate("shopOrder.shopOrderItems.item", "name image price")
                .populate('shopOrder.assignedDeliveryBoy', "fullName mobile")

            const formattedOrders = orders.map(order => {
                //in each order different owner are there so to filter that 
                const shopOrder = order.shopOrder.find(so => so.owner.toString() === req.userId.toString());
                return {
                    deliveryAddress: order.deliveryAddress,
                    paymentMethod: order.paymentMethod,
                    user: order.user,
                    shopOrder: shopOrder || null,
                    orderId: order._id
                };
            })

            return res.status(200).json(formattedOrders)
        }
    }
    catch (error) {
        return res.status(500).json({ message: `get User order error` })
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId, shopId } = req.params

    try {
        const { status } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const shopOrder = order.shopOrder.find(
            (o) => o.shop.toString() === shopId
        );
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" });
        }

        // ✅ update subdocument field
        shopOrder.status = status;
        let deliveryBoysPayload = []
        if (status == "outofdelivery" || !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress

            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                    }
                }
            })

            const nearByIds = nearByDeliveryBoys.map(b => b._id)

            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["broadcasted", "completed"] }
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(id => String(id)))
            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(b._id))
            const candidates = availableBoys.map(b => b._id)

            if (candidates.length == 0) {
                // ✅ only save parent
                await order.save();

                // ✅ populate nested items
                await order.populate("shopOrder.shopOrderItems.item", "name image price");

                return res.status(200).json({ message: "order status updated but there is no available delivery boys" });
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            })
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo

            shopOrder.assignment = deliveryAssignment._id

            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))
        }


        await shopOrder.save()
        await order.save()
        const updatedShopOrder = order.shopOrder.find(o => o.shop == shopId)
        // ✅ populate nested items
        await order.populate("shopOrder.shop", "name");
        await order.populate("shopOrder.assignedDeliveryBoy", "fullName email mobile");


        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment._id
        });
        // ✅ populate nested items

    } catch (error) {
        console.error("updateOrderStatus error", error);
        return res.status(500).json({ message: "Order status update failed" });
    }
};

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req?.userId
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "broadcasted"
        })
            .populate("order")
            .populate("shop")

        const formatted = assignments?.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrder.find(so => so._id.toString() === a.shopOrderId.toString())?.shopOrderItems || [],
            subtotal: a.order.shopOrder.find(so => so._id.toString() === a.shopOrderId.toString())?.subtotal

        }))
        return res.status(200).json(formatted)
    }
    catch (error) {
        console.error("getDeliveryBoyAssignment error", error);
        return res.status(500).json({ message: "getDeliveryBoy Assignment Error" });
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }
        if (assignment.status !== "broadcasted") {
            return res.status(400).json({ message: "assignment is  expired" })
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["broadcasted", "completed"] }
        })
        if (alreadyAssigned) {
            return res.status(400).json({ message: "you are already assigned to another order" })
        }
        assignment.assignedTo = req.userId
        assignment.status = 'assigned'
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }

        // const shopOrder = order.shopOrder.find(so => so._id == assignment.shopOrderId)
        const shopOrder = order.shopOrder.find(
            so => so._id.toString() === assignment.shopOrderId.toString()
        )
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
        await order.populate('shopOrder.assignedDeliveryBoy')

        return res.status(200).json({
            message: 'order accepted'
        })
    }
    catch (error) {
        console.error("acceptOrder error", error);
        return res.status(500).json({ message: "accept Order  Error" });

    }
}
export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{
                    path: "user",
                    select: "fullName email location mobile"
                },
                {
                    path: "shopOrder.shop",
                    select: "name address city"
                }
                ]
            })
        // console.log("assignment", assignment)

        if (!assignment) {
            return res.status(400).json({ message: "assignment not found" })
        }
        if (!assignment.order) {
            return res.status(400).json({ message: "order not found" })
        }
        const shopOrder = assignment.order.shopOrder.find(so => String(so._id) == String(assignment.shopOrderId))
        if (!shopOrder) {
            return res.status(400).json({ message: "shopOrder not found" })
        }

        let deliveryBoyLocation = { lat: null, lon: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }

        let customerLocation = { lat: null, lon: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude
        }


        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })

    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ message: "getCurrentOrder  Error" });

    }
}
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrder.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrder.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrder.shopOrderItems.item",
                model: "Item"
            })
            .lean()
        if (!order) {
            return res.status(400).json({ message: "order not found" })
        }
        return res.status(200).json(order)
    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ message: "getCurrentOrder  Error" });

    }
}
export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        const order = await Order.findById(orderId).populate("user")
        console.log(order);

        const shopOrder = order.shopOrder.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ message: "enter valid order/shopOrderid" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.OtpExpires = Date.now() + 5 * 60 * 1000
        await order.save()
        await sendDeliveryOtpMail(order.user, otp)
        return res.status(200).json({ message: `Otp send Successfully to ${order?.user?.fullName}` })
    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ message: "send Delivery Otp  Error" });

    }
}
export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrder.id(shopOrderId)
        if (!order || !shopOrder) {
            return res.status(400).json({ message: "enter valid order/shopOrderid" })
        }

        if (shopOrder.deliveryOtp !== otp || !shopOrder.OtpExpires || shopOrder.OtpExpires < Date.now()) {

            return res.status(400).json({ message: "Invalid/Expired Otp" });
        }
        shopOrder.status = "delivered"
        shopOrder.deliveredAt = Date.now()
        await order.save()
        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy
        })
        return res.status(200).json({ message: `Order Delivered Successfully to ${order?.user?.fullName}` })
    }
    catch (error) {
        console.error("error", error);
        return res.status(500).json({ message: "verify Delivery Otp  Error" });

    }
}