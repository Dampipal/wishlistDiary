import express from 'express';
import { createWishlist, deleteWishlist, editWishlist, getAllWishlists, getWishlist, summarizeWishlist } from '../controller/wishlist.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/summary", authMiddleware, summarizeWishlist);
router.get("/", authMiddleware, getAllWishlists);
router.post("/", authMiddleware, createWishlist);
router.get("/:id", authMiddleware, getWishlist);
router.put("/:id", authMiddleware, editWishlist);
router.delete("/:id", authMiddleware, deleteWishlist);


// Example route for user registration
export default router