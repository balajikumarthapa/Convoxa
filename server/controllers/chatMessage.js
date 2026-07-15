import ChatMessage from "../models/ChatMessage.js";
import ChatRoom from "../models/ChatRoom.js";

export const createMessage = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.body.chatRoomId);
    if (room?.blockedBy?.length > 0) {
      return res.status(403).json({
        message: "This conversation is blocked",
      });
    }

    const newMessage = new ChatMessage(req.body);
    await newMessage.save();
    const populated = await newMessage.populate("replyTo");
    res.status(201).json(populated);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const messages = await ChatMessage.find({
      chatRoomId: req.params.chatRoomId,
      deletedForEveryone: { $ne: true },
      ...(uid ? { deletedFor: { $ne: uid } } : {}),
    }).populate("replyTo");
    res.status(200).json(messages);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getLastMessage = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const message = await ChatMessage.findOne({
      chatRoomId: req.params.chatRoomId,
      deletedForEveryone: { $ne: true },
      ...(uid ? { deletedFor: { $ne: uid } } : {}),
    }).sort({ createdAt: -1 });
    res.status(200).json(message || null);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
  });
};

export const clearMessages = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ chatRoomId: req.params.chatRoomId });
    res.status(200).json({ message: "Chat cleared" });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

// Toggle (add/remove/replace) the requesting user's reaction on a message.
export const toggleReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const uid = req.user.uid;

    const message = await ChatMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const existingIndex = message.reactions.findIndex((r) => r.uid === uid);

    if (existingIndex !== -1 && message.reactions[existingIndex].emoji === emoji) {
      // Same emoji tapped again -> remove the reaction
      message.reactions.splice(existingIndex, 1);
    } else if (existingIndex !== -1) {
      // Different emoji -> replace this user's reaction
      message.reactions[existingIndex].emoji = emoji;
    } else {
      message.reactions.push({ uid, emoji });
    }

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

// Toggle the pinned message for a chat room (only one pinned at a time).
export const togglePin = async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.pinned) {
      message.pinned = false;
      await message.save();
      return res.status(200).json(message);
    }

    // Unpin any other pinned message in this room first.
    await ChatMessage.updateMany(
      { chatRoomId: message.chatRoomId, pinned: true },
      { pinned: false }
    );

    message.pinned = true;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getPinnedMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findOne({
      chatRoomId: req.params.chatRoomId,
      pinned: true,
    });
    res.status(200).json(message || null);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

// mode: "me" | "everyone"
export const deleteMessage = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { mode } = req.body;

    const message = await ChatMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (mode === "everyone") {
      if (message.sender !== uid) {
        return res.status(403).json({
          message: "Only the sender can delete this message for everyone",
        });
      }
      message.deletedForEveryone = true;
      message.message = "";
      message.fileUrl = null;
      message.fileName = null;
      message.fileType = null;
    } else {
      if (!message.deletedFor.includes(uid)) {
        message.deletedFor.push(uid);
      }
    }

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const markSeen = async (req, res) => {
  try {
    const uid = req.user.uid;
    await ChatMessage.updateMany(
      {
        chatRoomId: req.params.chatRoomId,
        sender: { $ne: uid },
        seenBy: { $ne: uid },
      },
      { $addToSet: { seenBy: uid } }
    );
    res.status(200).json({ message: "Marked as seen" });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};
