import express from "express";

import {
  createChatRoom,
  getChatRoomOfUser,
  getChatRoomOfUsers,
  toggleFavourite,
  toggleMute,
  toggleBlock,
} from "../controllers/chatRoom.js";

const router = express.Router();

router.post("/", createChatRoom);
router.patch("/favourite/:chatRoomId", toggleFavourite);
router.patch("/mute/:chatRoomId", toggleMute);
router.patch("/block/:chatRoomId", toggleBlock);
router.get("/:userId", getChatRoomOfUser);
router.get("/:firstUserId/:secondUserId", getChatRoomOfUsers);

export default router;
