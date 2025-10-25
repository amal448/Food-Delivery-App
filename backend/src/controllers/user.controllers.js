import User from "../models/user.model.js"

export const getUser = async (req, res) => {
    try {
        const userId = req.userId
        console.log("userId",userId);
        
        const user = await User.findOne({ _id: userId} )
        if(!user) return res.status(400).json({message:"Access Denied! Please Log Again"})
        return res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json(error.message)
    }
}