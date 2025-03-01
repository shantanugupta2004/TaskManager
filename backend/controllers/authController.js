import { CreateUser, getUser } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) =>{
    const {name, email, password} = req.body;
    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const userId = await CreateUser(name, email, hashedPass);
        res.json({userId});
    } catch (error) {
        console.error("Registration failed", error);
        res.status(500).json({error: "Registration failed"});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await getUser(email);
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token, email: user.email});
    } catch (error) {
        console.error("Login failed", error);
        res.status(500).json({error: "Login failed"});
    }
};