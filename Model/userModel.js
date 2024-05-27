const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  profileImage: {
    type: String,
    default: "default-profile-photo.jpg",
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
  },
  liked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
  },
  commented: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  roomId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Room",
  },
  savedPosts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "SavedPost",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
