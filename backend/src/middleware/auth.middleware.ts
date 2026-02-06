import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRouter = async (req: any, res: any, next: any) => {
    try{
        const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if(!decoded){
        return res.status(401).json({ message: "Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(401).json({ message: "User not found." });
    }
    //作为中间件，把user信息挂载到req对象上，方便后续使用
    req.user = user;
    next();
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

