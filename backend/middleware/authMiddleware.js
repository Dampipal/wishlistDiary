import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // .env variables load karna zaroori hai

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // ✅ Correct casing

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // ✅ Inject decoded token (e.g. { id, email, name })
        next(); // ✅ All good, proceed
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
