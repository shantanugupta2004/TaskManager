import { register, login, forgotPass} from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot', forgotPass);

export default router;