import axios from "axios";
import auth from "../config/firebase";
import { io } from "socket.io-client";

const baseURL = "https://convoxa-server.onrender.com/api";
export const SERVER_URL = "https://convoxa-server.onrender.com";

const getUserToken = async () => {
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());
  return token;
};

export const initiateSocketConnection = async () => {
  const token = await getUserToken();

  const socket = io("https://convoxa-server.onrender.com", {
    auth: {
      token,
    },
  });

  return socket;
};

const createHeader = async () => {
  const token = await getUserToken();

  const payloadHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return payloadHeader;
};

export const getAllUsers = async () => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/user`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getUser = async (userId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/user/${userId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getUsers = async (users) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/user/users`, users, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getChatRooms = async (userId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/room/${userId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getChatRoomOfUsers = async (firstUserId, secondUserId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(
      `${baseURL}/room/${firstUserId}/${secondUserId}`,
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const createChatRoom = async (members) => {
  const header = await createHeader();

  try {
    const res = await axios.post(`${baseURL}/room`, members, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const toggleFavouriteRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/room/favourite/${chatRoomId}`,
      {},
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const toggleMuteRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/room/mute/${chatRoomId}`,
      {},
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const toggleBlockRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/room/block/${chatRoomId}`,
      {},
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getMessagesOfChatRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/message/${chatRoomId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getLastMessageOfChatRoom = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/message/last/${chatRoomId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const sendMessage = async (messageBody) => {
  const header = await createHeader();

  try {
    const res = await axios.post(`${baseURL}/message`, messageBody, header);
    return res.data;
  } catch (e) {
    console.error(e);
    return { error: e.response?.data?.message || "Failed to send message" };
  }
};

export const uploadFile = async (file) => {
  const token = await getUserToken();

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${baseURL}/message/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // { fileUrl, fileName, fileType }
  } catch (e) {
    console.error(e);
  }
};
export const clearMessages = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.delete(`${baseURL}/message/${chatRoomId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const toggleReaction = async (messageId, emoji) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/message/react/${messageId}`,
      { emoji },
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const togglePin = async (messageId) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/message/pin/${messageId}`,
      {},
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getPinnedMessage = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.get(`${baseURL}/message/pinned/${chatRoomId}`, header);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

// mode: "me" | "everyone"
export const deleteMessage = async (messageId, mode) => {
  const header = await createHeader();

  try {
    const res = await axios.delete(`${baseURL}/message/single/${messageId}`, {
      ...header,
      data: { mode },
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const markMessagesSeen = async (chatRoomId) => {
  const header = await createHeader();

  try {
    const res = await axios.patch(
      `${baseURL}/message/seen/${chatRoomId}`,
      {},
      header
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};