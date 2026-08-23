import {Router} from "express";
import {changePassword, login, session} from "../controllers/authController.js";
import {protect} from "../middleware/auth.js";
import {loginRateLimit} from "../middleware/rateLimit.js";

const authRouter = Router();
authRouter.post("/login",loginRateLimit,login)
authRouter.get("/session",protect,session)
authRouter.post("/change-password",protect,changePassword)

export default authRouter;