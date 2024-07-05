import mongoose, { Schema } from "mongoose";

interface chat {
    type: String,
    message: String
  }

const ChatSchema = new Schema({

    userID: {
        type: String,
        required: true
    },
    chats: {
        type: Array<chat>
    }

});

export const chats = mongoose.models.chats || mongoose.model('chats', ChatSchema);