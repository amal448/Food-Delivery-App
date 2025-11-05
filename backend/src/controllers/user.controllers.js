import User from "../models/user.model.js"

export const getUser = async (req, res) => {
    try {
        const userId = req.userId
        // console.log("userId",userId);

        const user = await User.findOne({ _id: userId })
        if (!user) return res.status(400).json({ message: "Access Denied! Please Log Again" })
        return res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json(error.message)
    }
}
export const updateUserLocation = async (req, res) => {
    try {
        const { lat, lon } = req.body
        console.log("updateUserLocation",lat, lon);
        
        const user = await User.findByIdAndUpdate(req.userId, {
            location: {
                type: 'Point',
                coordinates: [lon, lat]
            }
         
        }, { new: true })

        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }
        return res.status(200).json({ message: 'location updated' })
    }
    catch (error) {
        return res.status(500).json(error.message)

    }
}