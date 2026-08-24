import { Router } from "express";
import { protect,protectAdmin } from "../middleware/auth";
import {createLeave, getLeave, updateLeave} from "../controllers/leaveController"

const leaveRouter = Router();
leaveRouter.post("/", protect,createLeave);
leaveRouter.get("/",protect,getLeave);
leaveRouter.patch("/:id", protect,protectAdmin,updateLeave);

export default leaveRouter;