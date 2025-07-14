import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    image_url:{
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        set: function() {
            return Date.now();
        }
    },
    priority:{
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 3
    },
    notes:{
        type: String,
        default: '',
    }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
