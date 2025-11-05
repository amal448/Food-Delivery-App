import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    const token = req.cookies.token
    console.log("token",token);
    try {
        
        if (!token) {
            return res.status(400).json({ message: "token not found" })
        }
        const decodetoken = await jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodetoken.userId
        next()
    }
    catch (error) {
        console.log(error);
        
            return res.status(500).json({ message: "Account Authorization Failed" })

    }
}
export default isAuth;