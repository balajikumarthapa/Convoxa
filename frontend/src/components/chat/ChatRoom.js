import { useState, useEffect, useRef, Fragment } from "react";
import { FiPhone, FiVideo, FiSearch, FiMoreVertical, FiChevronDown, FiX, FiShare2, FiTrash2 } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";

import {
  getMessagesOfChatRoom,
  sendMessage,
  clearMessages,
  getUser,
  toggleReaction,
  togglePin,
  getPinnedMessage,
  deleteMessage,
  markMessagesSeen,
  toggleFavouriteRoom,
  toggleMuteRoom,
  toggleBlockRoom,
} from "../../services/ChatService";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";
import ContactPanel from "./ContactPanel";
import MoreOptionsPanel from "./MoreOptionsPanel";
import ForwardModal from "./ForwardModal";

function MessageSkeleton({ align = "start" }) {
  const width = align === "end" ? "w-40" : "w-52";
  return (
    <li className={`flex ${align === "end" ? "justify-end" : "justify-start"}`}>
      <div className={`h-10 ${width} rounded-2xl skeleton`}></div>
    </li>
  );
}

function dateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function DateDivider({ label }) {
  return (
    <li className="flex justify-center py-2">
      <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 shadow-sm">
        {label}
      </span>
    </li>
  );
}

export default function ChatRoom({
  currentChat,
  currentUser,
  socket,
  onlineUsersId,
  chatRooms,
  onChatRoomUpdate,
}) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // null | "profile" | "more"
  const [contactTyping, setContactTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [contact, setContact] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [forwardingBatch, setForwardingBatch] = useState(null);

  const scrollRef = useRef();
  const highlightTimeoutRef = useRef();

  const receiverId = currentChat.members.find(
    (member) => member !== currentUser.uid
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMessages(true);
      const res = await getMessagesOfChatRoom(currentChat._id);
      setMessages(res || []);
      setLoadingMessages(false);
    };

    fetchData();
    setActivePanel(null);
    setShowSearch(false);
    setSearchText("");
    setContactTyping(false);
    setReplyingTo(null);
    setSelectMode(false);
    setSelectedIds([]);
  }, [currentChat._id]);

  const isFavourite = (currentChat.favouritedBy || []).includes(currentUser.uid);
  const isMuted = (currentChat.mutedBy || []).includes(currentUser.uid);
  const isBlockedByMe = (currentChat.blockedBy || []).includes(currentUser.uid);
  const isBlocked = (currentChat.blockedBy || []).length > 0;

  useEffect(() => {
    const fetchContact = async () => {
      const res = await getUser(receiverId);
      setContact(res || null);
    };
    fetchContact();
  }, [receiverId]);

  const contactName = contact?.displayName || "";
  const contactAvatar = contact?.photoURL || "";

  useEffect(() => {
    const fetchPinned = async () => {
      const res = await getPinnedMessage(currentChat._id);
      setPinnedMessage(res);
    };
    fetchPinned();
  }, [currentChat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, contactTyping]);

  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setIncomingMessage({
        senderId: data.senderId,
        message: data.message,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
        replyTo: data.replyTo,
        reactions: [],
        seenBy: [],
        createdAt: new Date().toISOString(),
      });
    });
  }, [socket]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  useEffect(() => {
    const currentSocket = socket.current;

    const handleTypingEvent = (data) => {
      if (data.senderId === receiverId) setContactTyping(true);
    };
    const handleStopTypingEvent = (data) => {
      if (data.senderId === receiverId) setContactTyping(false);
    };
    const handleMessageReacted = ({ message: updated }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    };
    const handleMessagePinned = ({ message: updated }) => {
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          pinned: m._id === updated._id ? updated.pinned : false,
        }))
      );
      setPinnedMessage(updated.pinned ? updated : null);
    };
    const handleMessageDeleted = ({ message: updated }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
    };
    const handleMessagesSeen = ({ chatRoomId, seenBy }) => {
      if (chatRoomId !== currentChat._id) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === currentUser.uid && !(m.seenBy || []).includes(seenBy)
            ? { ...m, seenBy: [...(m.seenBy || []), seenBy] }
            : m
        )
      );
    };

    currentSocket?.on("typing", handleTypingEvent);
    currentSocket?.on("stopTyping", handleStopTypingEvent);
    currentSocket?.on("messageReacted", handleMessageReacted);
    currentSocket?.on("messagePinned", handleMessagePinned);
    currentSocket?.on("messageDeleted", handleMessageDeleted);
    currentSocket?.on("messagesSeen", handleMessagesSeen);

    return () => {
      currentSocket?.off("typing", handleTypingEvent);
      currentSocket?.off("stopTyping", handleStopTypingEvent);
      currentSocket?.off("messageReacted", handleMessageReacted);
      currentSocket?.off("messagePinned", handleMessagePinned);
      currentSocket?.off("messageDeleted", handleMessageDeleted);
      currentSocket?.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, receiverId, currentChat._id, currentUser.uid]);

  // Mark incoming messages as seen the moment they're visible in the open chat,
  // and let the sender know in real time.
  useEffect(() => {
    const hasUnseenIncoming = messages.some(
      (m) =>
        m._id &&
        m.sender === receiverId &&
        !(m.seenBy || []).includes(currentUser.uid)
    );
    if (!hasUnseenIncoming) return;

    const markSeen = async () => {
      await markMessagesSeen(currentChat._id);
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === receiverId && !(m.seenBy || []).includes(currentUser.uid)
            ? { ...m, seenBy: [...(m.seenBy || []), currentUser.uid] }
            : m
        )
      );
      socket.current?.emit("messagesSeen", {
        receiverId,
        chatRoomId: currentChat._id,
        seenBy: currentUser.uid,
      });
    };
    markSeen();
  }, [messages, currentChat._id, currentUser.uid, receiverId, socket]);

  const handleTyping = () => {
    socket.current?.emit("typing", {
      senderId: currentUser.uid,
      receiverId,
    });
  };

  const handleStopTyping = () => {
    socket.current?.emit("stopTyping", {
      senderId: currentUser.uid,
      receiverId,
    });
  };

  const handleFormSubmit = async (payload) => {
    if (isBlocked) return;

    const messageData = {
      message: payload.message || "",
      fileUrl: payload.fileUrl || null,
      fileName: payload.fileName || null,
      fileType: payload.fileType || null,
      replyTo: payload.replyTo || null,
    };

    const messageBody = {
      chatRoomId: currentChat._id,
      sender: currentUser.uid,
      ...messageData,
    };
    const res = await sendMessage(messageBody);

    if (!res || res.error) {
      alert(res?.error || "Message couldn't be sent.");
      return;
    }

    socket.current.emit("sendMessage", {
      senderId: currentUser.uid,
      receiverId: receiverId,
      ...messageData,
    });

    setMessages((prev) => [...prev, res]);
    setReplyingTo(null);
  };

  const handleClearChat = async () => {
    await clearMessages(currentChat._id);
    setMessages([]);
    setPinnedMessage(null);
  };

  const handleReact = async (message, emoji) => {
    const updated = await toggleReaction(message._id, emoji);
    if (!updated) return;
    setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    socket.current?.emit("messageReacted", { receiverId, message: updated });
  };

  const scrollToMessage = (messageId) => {
    if (!messageId) return;
    const el = document.getElementById(`message-${messageId}`);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    clearTimeout(highlightTimeoutRef.current);
    setHighlightedMessageId(messageId);
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedMessageId((current) => (current === messageId ? null : current));
    }, 1600);
  };

  useEffect(() => {
    return () => clearTimeout(highlightTimeoutRef.current);
  }, []);

  const handleTogglePin = async (message) => {
    const updated = await togglePin(message._id);
    if (!updated) return;
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        pinned: m._id === updated._id ? updated.pinned : false,
      }))
    );
    setPinnedMessage(updated.pinned ? updated : null);
    socket.current?.emit("messagePinned", { receiverId, message: updated });
  };

  const handleDeleteMessage = async (message, mode) => {
    const updated = await deleteMessage(message._id, mode);
    if (!updated) return;
    if (mode === "me") {
      setMessages((prev) => prev.filter((m) => m._id !== message._id));
    } else {
      setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      socket.current?.emit("messageDeleted", { receiverId, message: updated });
    }
    if (pinnedMessage?._id === message._id) setPinnedMessage(null);
  };

  const handleForwardConfirm = async (targetRooms) => {
    if (!forwardingMessage && !forwardingBatch) return;

    const messagesToForward = forwardingBatch || [forwardingMessage];

    for (const room of targetRooms) {
      const targetReceiverId = room.members.find((m) => m !== currentUser.uid);

      for (const original of messagesToForward) {
        const messageData = {
          message: original.message || "",
          fileUrl: original.fileUrl || null,
          fileName: original.fileName || null,
          fileType: original.fileType || null,
          replyTo: null,
        };

        const res = await sendMessage({
          chatRoomId: room._id,
          sender: currentUser.uid,
          ...messageData,
        });

        if (res && !res.error) {
          socket.current?.emit("sendMessage", {
            senderId: currentUser.uid,
            receiverId: targetReceiverId,
            ...messageData,
          });
        }
      }
    }

    setForwardingMessage(null);
    setForwardingBatch(null);
    setSelectMode(false);
    setSelectedIds([]);
  };

  const handleToggleFavourite = async () => {
    const updated = await toggleFavouriteRoom(currentChat._id);
    if (updated) onChatRoomUpdate?.(updated);
  };

  const handleToggleMute = async () => {
    const updated = await toggleMuteRoom(currentChat._id);
    if (updated) onChatRoomUpdate?.(updated);
  };

  const handleToggleBlock = async () => {
    const updated = await toggleBlockRoom(currentChat._id);
    if (updated) onChatRoomUpdate?.(updated);
  };

  const handleToggleSelect = (messageId) => {
    setSelectedIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} message(s) for me?`)) return;

    for (const id of selectedIds) {
      await deleteMessage(id, "me");
    }
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m._id)));
    setSelectMode(false);
    setSelectedIds([]);
  };

  const handleBulkForward = () => {
    const batch = messages.filter((m) => selectedIds.includes(m._id));
    if (batch.length === 0) return;
    setForwardingBatch(batch);
  };

  return (
    <div className="relative flex flex-col h-full w-full flex-1 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {selectMode ? (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelSelect}
                className="p-2 -ml-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <FiX size={19} />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                title="Forward"
                onClick={handleBulkForward}
                disabled={selectedIds.length === 0}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 disabled:opacity-30 transition"
              >
                <FiShare2 size={18} />
              </button>
              <button
                title="Delete"
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 transition"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </>
        ) : showSearch ? (
          <input
            type="text"
            autoFocus
            placeholder="Search messages..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-full text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
          />
        ) : (
          <button
            onClick={() =>
              setActivePanel((v) => (v === "profile" ? null : "profile"))
            }
            className="flex items-center gap-2 -ml-1 pr-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition min-w-0"
          >
            <Contact
              chatRoom={currentChat}
              currentUser={currentUser}
              onlineUsersId={onlineUsersId}
              size="sm"
              showStatus
            />
            <FiChevronDown
              size={15}
              className={`text-slate-400 shrink-0 transition-transform ${
                activePanel === "profile" ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        {!selectMode && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              title="Audio call"
              onClick={() => alert("📞 Audio call — coming soon!")}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-90 transition"
            >
              <FiPhone size={19} />
            </button>

            <button
              title="Video call"
              onClick={() => alert("🎥 Video call — coming soon!")}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-90 transition"
            >
              <FiVideo size={19} />
            </button>

            <button
              title="Search"
              onClick={() => {
                if (showSearch) {
                  setSearchText("");
                }
                setShowSearch(!showSearch);
              }}
              className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
                showSearch
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <FiSearch size={19} />
            </button>

            <button
              title="More"
              onClick={() =>
                setActivePanel((v) => (v === "more" ? null : "more"))
              }
              className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800/60 ${
                activePanel === "more"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <FiMoreVertical size={19} />
            </button>
          </div>
        )}
      </div>

      {pinnedMessage && (
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-800/40">
          <BsPinAngleFill size={13} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="truncate text-xs text-rose-700 dark:text-rose-300 flex-1">
            {pinnedMessage.message || pinnedMessage.fileName || "Attachment"}
          </span>
          <button
            onClick={() => handleTogglePin(pinnedMessage)}
            className="shrink-0 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
          >
            Unpin
          </button>
        </div>
      )}

      <div className="relative flex-1 min-h-0 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-4 bg-slate-50 dark:bg-black chat-wallpaper">
        <ul className="space-y-1">
          {loadingMessages ? (
            <>
              <MessageSkeleton align="start" />
              <MessageSkeleton align="end" />
              <MessageSkeleton align="start" />
            </>
          ) : (
            <>
              {(() => {
                const filtered = messages.filter((message) =>
                  message.message
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                );
                let lastLabel = null;

                const lastSeenSelfMessageId = [...messages]
                  .reverse()
                  .find(
                    (m) =>
                      m.sender === currentUser.uid &&
                      (m.seenBy || []).includes(receiverId)
                  )?._id;

                return filtered.map((message, index) => {
                  const label = dateLabel(message.createdAt || Date.now());
                  const showDivider = label !== lastLabel;
                  lastLabel = label;

                  return (
                    <Fragment key={message._id || index}>
                      {showDivider && <DateDivider label={label} />}
                      <Message
                        message={message}
                        self={currentUser.uid}
                        contactName={contactName}
                        onReply={setReplyingTo}
                        onForward={setForwardingMessage}
                        onTogglePin={handleTogglePin}
                        onDelete={handleDeleteMessage}
                        onReact={handleReact}
                        onJumpToMessage={scrollToMessage}
                        highlighted={highlightedMessageId === message._id}
                        receiverId={receiverId}
                        receiverOnline={onlineUsersId?.includes(receiverId)}
                        contactAvatar={contactAvatar}
                        showSeenAvatar={message._id === lastSeenSelfMessageId}
                        selectMode={selectMode}
                        selected={selectedIds.includes(message._id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    </Fragment>
                  );
                });
              })()}

              {showSearch &&
                searchText &&
                messages.filter((m) =>
                  m.message.toLowerCase().includes(searchText.toLowerCase())
                ).length === 0 && (
                  <li className="flex flex-col items-center text-center gap-2 py-10 text-slate-400 dark:text-slate-500">
                    <FiSearch size={24} className="opacity-50" />
                    <span className="text-sm">
                      No messages match "{searchText}"
                    </span>
                  </li>
                )}
            </>
          )}

          {contactTyping && (
            <li className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></span>
              </div>
            </li>
          )}

          <div ref={scrollRef}></div>
        </ul>
      </div>

      {isBlocked ? (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
          {isBlockedByMe
            ? "You blocked this contact. Unblock to send messages."
            : "You can't reply to this conversation."}
        </div>
      ) : (
        <ChatForm
          handleFormSubmit={handleFormSubmit}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          replyingTo={
            replyingTo && {
              ...replyingTo,
              senderName: replyingTo.sender === currentUser.uid ? "You" : contactName,
            }
          }
          onCancelReply={() => setReplyingTo(null)}
        />
      )}

      <ContactPanel
        open={activePanel === "profile"}
        onClose={() => setActivePanel(null)}
        chatRoom={currentChat}
        currentUser={currentUser}
        onlineUsersId={onlineUsersId}
        messages={messages}
      />

      <MoreOptionsPanel
        open={activePanel === "more"}
        onClose={() => setActivePanel(null)}
        onClearChat={handleClearChat}
        isFavourite={isFavourite}
        isMuted={isMuted}
        isBlocked={isBlockedByMe}
        onToggleFavourite={handleToggleFavourite}
        onToggleMute={handleToggleMute}
        onToggleBlock={handleToggleBlock}
        onSelectMessages={() => setSelectMode(true)}
      />

      {(forwardingMessage || forwardingBatch) && (
        <ForwardModal
          message={forwardingMessage || forwardingBatch[0]}
          extraCount={forwardingBatch ? forwardingBatch.length - 1 : 0}
          chatRooms={chatRooms}
          currentChatId={currentChat._id}
          currentUser={currentUser}
          onlineUsersId={onlineUsersId}
          onClose={() => {
            setForwardingMessage(null);
            setForwardingBatch(null);
          }}
          onConfirm={handleForwardConfirm}
        />
      )}
    </div>
  );
}
