const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        type: String
    },
    caption: {
        type: String,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});


const Post = mongoose.model("Post", postSchema, "posts");

module.exports = Post;