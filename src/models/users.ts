import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'Username should be unique'],
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        unique: [true, 'Email should be unique'],
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});
export const users = mongoose.models.users || mongoose.model('users', UserSchema);