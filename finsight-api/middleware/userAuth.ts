import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userId = (decoded as { userId: string }).userId; // extract userId from token for use in requests
        next();
    } catch (err) {
        console.log("🚀 ~ authenticateUser ~ err:", err)
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};