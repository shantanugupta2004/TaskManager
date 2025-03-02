import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message: "Access denied"});
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
}