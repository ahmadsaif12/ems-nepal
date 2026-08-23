import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const session = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(session.userId).select("tokenVersion").lean();

    if (!user || (user.tokenVersion || 0) !== (session.tokenVersion ?? 0)) {
      return res.status(401).json({ error: "unauthorized" });
    }

    req.session = session;
    next();
  } catch (error) {
    return res.status(401).json({ error: "unauthorized" });
  }
};

export const protectAdmin = (req,res,next)=>{
  if(req?.session?.role !=="ADMIN"){
    return res.status(403).json({error:"Admin access required"})
  };
  next()
}
