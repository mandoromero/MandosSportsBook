import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleInitial: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {type: String},
    dob: { type: Date, required: true },
    passwordHash: { type: String, required: true },
}, { timeStamps: true });

const User = mongoose.model("User", userShema);

export default User;