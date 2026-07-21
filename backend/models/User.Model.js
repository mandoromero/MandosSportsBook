import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership: {
    type: String,
    enum: ["free", "premium", "vip"],
    default: "free",
  },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
