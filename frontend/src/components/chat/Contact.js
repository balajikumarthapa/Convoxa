import { useState, useEffect } from "react";
import { format } from "timeago.js";
import { FiImage, FiFileText } from "react-icons/fi";

import { getUser, getLastMessageOfChatRoom } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

function readKey(uid, chatRoomId) {
  return `lastRead_${uid}_${chatRoomId}`;
}

export default function Contact({
  chatRoom,
  onlineUsersId,
  currentUser,
  size,
  showStatus,
  align,
  showPreview,
  isActive,
}) {
  const [contact, setContact] = useState();
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const contactId = chatRoom.members?.find(
      (member) => member !== currentUser.uid
    );

    const fetchData = async () => {
      const res = await getUser(contactId);
      setContact(res);
    };

    fetchData();
  }, [chatRoom, currentUser]);

  useEffect(() => {
    if (!showPreview || !chatRoom?._id) return;

    const fetchLastMessage = async () => {
      const res = await getLastMessageOfChatRoom(chatRoom._id);
      setLastMessage(res);
    };

    fetchLastMessage();
  }, [showPreview, chatRoom]);

  // Mark the room as read the moment it becomes the active chat.
  useEffect(() => {
    if (!showPreview || !isActive || !chatRoom?._id) return;
    const timestamp = lastMessage?.createdAt || new Date().toISOString();
    localStorage.setItem(
      readKey(currentUser.uid, chatRoom._id),
      timestamp
    );
  }, [isActive, showPreview, chatRoom, lastMessage, currentUser.uid]);

  let subtitle;
  let fileIndicator;
  let isUnread = false;

  if (showPreview) {
    if (lastMessage) {
      const isSelf = lastMessage.sender === currentUser.uid;
      const prefix = isSelf ? "You: " : "";
      if (lastMessage.message) {
        subtitle = `${prefix}${lastMessage.message}`;
      } else if (lastMessage.fileType?.startsWith("image/")) {
        subtitle = `${prefix}Photo`;
        fileIndicator = <FiImage size={13} className="shrink-0 opacity-70" />;
      } else if (lastMessage.fileUrl) {
        subtitle = `${prefix}${lastMessage.fileName || "File"}`;
        fileIndicator = <FiFileText size={13} className="shrink-0 opacity-70" />;
      }

      if (!isSelf && !isActive) {
        const lastRead = localStorage.getItem(
          readKey(currentUser.uid, chatRoom._id)
        );
        isUnread = !lastRead || new Date(lastMessage.createdAt) > new Date(lastRead);
      }
    } else {
      subtitle = "No messages yet";
    }
  }

  return (
    <UserLayout
      user={contact}
      onlineUsersId={onlineUsersId}
      size={size}
      showStatus={showStatus}
      align={align}
      subtitle={subtitle}
      fileIndicator={fileIndicator}
      meta={showPreview && lastMessage ? format(lastMessage.createdAt) : undefined}
      unread={isUnread}
    />
  );
}
