import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authMiddleware =async (req,res,next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1]
            const decoded =jwt.verify(token,process.env.ACCESS_SECRET)
            req.user = await User.findById(decoded.id).select("-password");
            next()
        }else{
            res.status(401).json({message: "Unauthorized - No Token Found"})
        }
    } catch (error) {
        res.status(401).json({ message:"Token Failed ", error: error.message })
    }
}


