import mongoose from "mongoose";

const ChatMessageSchema = mongoose.Schema(
  {
    chatRoomId: String,
    sender: String,
    message: String,
    fileUrl: String,
    fileName: String,
    fileType: String,
    reactions: [
      {
        uid: String,
        emoji: String,
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
      default: null,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    deletedFor: [String],
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    seenBy: [String],
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;