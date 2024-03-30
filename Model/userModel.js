const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
      next();
  } catch (error) {
      return next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
      return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
      throw new Error('Password comparison failed');
  }
};


const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
