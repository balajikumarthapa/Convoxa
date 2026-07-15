import express from "express";

import {
  createMessage,
  getMessages,
  getLastMessage,
  getPinnedMessage,
  uploadFile,
  clearMessages,
  toggleReaction,
  togglePin,
  deleteMessage,
  markSeen,
} from "../controllers/chatMessage.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/last/:chatRoomId", getLastMessage);
router.get("/pinned/:chatRoomId", getPinnedMessage);
router.get("/:chatRoomId", getMessages);
router.post("/upload", upload.single("file"), uploadFile);
router.patch("/react/:messageId", toggleReaction);
router.patch("/pin/:messageId", togglePin);
router.patch("/seen/:chatRoomId", markSeen);
router.delete("/single/:messageId", deleteMessage);
router.delete("/:chatRoomId", clearMessages);

export default router;
