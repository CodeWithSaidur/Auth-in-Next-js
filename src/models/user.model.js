import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    vToken: String,
    vTokenExpiry: Date,
    fpToken: String,
    fpTokenExpiry: Date
  },

  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
