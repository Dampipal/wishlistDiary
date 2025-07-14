import mongoose from 'mongoose';
import Wishlist from "../modal/wishlist.js";

// ============================
// CREATE Wishlist
// ============================
export const createWishlist = async (req, res) => {
    const userId = req.user.id;
    const { title, description, category, status, image_url, priority, notes } = req.body;

    if (!title || !category) {
        return res.status(400).json({ message: "Title and category are required" });
    }

    try {
        const wishlist = await Wishlist.create({
            userId,
            title,
            description,
            category,
            status,
            image_url,
            priority,
            notes,
        });

        res.status(201).json({ message: "Wishlist created successfully", wishlist });
    } catch (error) {
        console.error("Create wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ============================
// EDIT Wishlist
// ============================
export const editWishlist = async (req, res) => {
    const userId = req.user.id;
    const wishlistId = req.params.id;

    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            { _id: wishlistId, userId },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found or unauthorized" });
        }

        res.status(200).json({ message: "Wishlist updated successfully", wishlist });
    } catch (error) {
        console.error("Edit wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ============================
// DELETE Wishlist
// ============================
export const deleteWishlist = async (req, res) => {
    const userId = req.user.id;
    const wishlistId = req.params.id;

    try {
        const result = await Wishlist.findOneAndDelete({ _id: wishlistId, userId });

        if (!result) {
            return res.status(404).json({ message: "Wishlist not found or unauthorized" });
        }

        res.status(200).json({ message: "Wishlist deleted successfully" });
    } catch (error) {
        console.error("Delete wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ============================
// GET SINGLE Wishlist
// ============================
export const getWishlist = async (req, res) => {
    const userId = req.user.id;
    const wishlistId = req.params.id;

    try {
        const wishlist = await Wishlist.findOne({ _id: wishlistId, userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found or unauthorized" });
        }

        res.status(200).json({ wishlist });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ============================
// GET ALL Wishlists (of logged-in user)
// ============================
export const getAllWishlists = async (req, res) => {
    const userId = req.user.id;

    try {
        const wishlists = await Wishlist.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({ wishlists });
    } catch (error) {
        console.error("Get all wishlists error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ============================
// SUMMARIZE Wishlist (stats)
// ============================
export const summarizeWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        const total = await Wishlist.countDocuments({ userId });
        const completed = await Wishlist.countDocuments({ userId, status: "completed" });
        const pending = await Wishlist.countDocuments({ userId, status: "pending" });
        const cancelled = await Wishlist.countDocuments({ userId, status: "cancelled" });

        const categoryStats = await Wishlist.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        const priorityStats = await Wishlist.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        res.status(200).json({
            message: `Total wishlist items: ${total}. Completed: ${completed}, Pending: ${pending}, Cancelled: ${cancelled}.`,
            summary: {
                total,
                completed,
                pending,
                cancelled,
                categories: categoryStats.map(c => ({ category: c._id, count: c.count })),
                priorities: priorityStats.map(p => ({ priority: p._id, count: p.count })),
            }
        });
    } catch (error) {
        console.error("Summarize wishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
