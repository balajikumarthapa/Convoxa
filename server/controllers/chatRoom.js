import ChatRoom from "../models/ChatRoom.js";

export const createChatRoom = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Check whether a chat room already exists
    const existingRoom = await ChatRoom.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingRoom) {
      return res.status(200).json(existingRoom);
    }

    // Create a new room only if one doesn't exist
    const newChatRoom = new ChatRoom({
      members: [senderId, receiverId],
    });

    await newChatRoom.save();

    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getChatRoomOfUser = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getChatRoomOfUsers = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

function toggleUidInArray(doc, field, uid) {
  const list = doc[field] || [];
  const index = list.indexOf(uid);
  if (index === -1) {
    list.push(uid);
  } else {
    list.splice(index, 1);
  }
  doc[field] = list;
}

export const toggleFavourite = async (req, res) => {
  try {
    const uid = req.user.uid;
    const room = await ChatRoom.findById(req.params.chatRoomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    toggleUidInArray(room, "favouritedBy", uid);
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const toggleMute = async (req, res) => {
  try {
    const uid = req.user.uid;
    const room = await ChatRoom.findById(req.params.chatRoomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    toggleUidInArray(room, "mutedBy", uid);
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const toggleBlock = async (req, res) => {
  try {
    const uid = req.user.uid;
    const room = await ChatRoom.findById(req.params.chatRoomId);
    if (!room) return res.status(404).json({ message: "Chat room not found" });

    toggleUidInArray(room, "blockedBy", uid);
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
