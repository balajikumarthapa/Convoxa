import { useState, useRef, useEffect } from "react";
import {
  FiFile,
  FiDownload,
  FiX,
  FiFileText,
  FiMusic,
  FiVideo,
  FiArchive,
  FiCornerUpLeft,
  FiCopy,
  FiShare2,
  FiTrash2,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill, BsCheck2, BsCheck2All } from "react-icons/bs";

const SERVER_URL = "https://convoxa-server.onrender.com";
const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatMessageTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isSameDay) return time;

  const dateLabel = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  return `${dateLabel}, ${time}`;
}

export function getExtension(fileName = "") {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export function FileIcon({ fileName, fileType, className }) {
  const ext = getExtension(fileName);

  if (fileType?.startsWith("audio/") || ["mp3", "wav", "m4a"].includes(ext)) {
    return <FiMusic className={className} />;
  }
  if (fileType?.startsWith("video/") || ["mp4", "mov", "avi", "webm"].includes(ext)) {
    return <FiVideo className={className} />;
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return <FiArchive className={className} />;
  }
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
    return <FiFileText className={className} />;
  }
  return <FiFile className={className} />;
}

export function Lightbox({ src, alt, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <FiX size={22} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
        className="rounded-lg shadow-2xl object-contain"
      />
    </div>
  );
}

function Attachment({ message, isSelf, selectMode }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!message.fileUrl) return null;

  const fullUrl = SERVER_URL + message.fileUrl;
  const isImage =
    message.fileType && message.fileType.startsWith("image/");

  if (isImage) {
    return (
      <>
        <button
          type="button"
          disabled={selectMode}
          onClick={() => setLightboxOpen(true)}
          className="block overflow-hidden rounded-lg disabled:cursor-default"
          style={{ width: 220, height: 220 }}
        >
          <img
            src={fullUrl}
            alt={message.fileName || "attachment"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className={selectMode ? "" : "hover:opacity-90 transition"}
          />
        </button>
        {lightboxOpen && (
          <Lightbox
            src={fullUrl}
            alt={message.fileName}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <a
      href={selectMode ? undefined : fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={message.fileName}
      onClick={(e) => selectMode && e.preventDefault()}
      className={classNames(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition",
        selectMode ? "cursor-pointer" : "",
        isSelf
          ? "bg-rose-700/60 hover:bg-rose-700 text-white"
          : "bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
      )}
      style={{ minWidth: 190, maxWidth: 240 }}
    >
      <FileIcon
        fileName={message.fileName}
        fileType={message.fileType}
        className="shrink-0"
      />
      <span className="truncate text-xs font-medium flex-1">
        {message.fileName}
      </span>
      <FiDownload size={15} className="shrink-0 opacity-70" />
    </a>
  );
}

function ReplyQuote({ replyTo, isSelf, currentUserName = "You", contactName, onJump }) {
  if (!replyTo) return null;

  const label = replyTo.sender === replyTo.currentSelf ? currentUserName : contactName;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onJump?.(replyTo._id);
      }}
      className={classNames(
        "mb-1.5 pl-2.5 py-1 border-l-2 rounded text-xs max-w-full text-left transition",
        isSelf
          ? "border-white/50 bg-white/10 hover:bg-white/20"
          : "border-rose-500 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900/70"
      )}
    >
      <p
        className={classNames(
          "font-semibold truncate",
          isSelf ? "text-white/90" : "text-rose-600 dark:text-rose-400"
        )}
      >
        {label}
      </p>
      <p
        className={classNames(
          "truncate",
          isSelf ? "text-white/70" : "text-slate-500 dark:text-slate-400"
        )}
      >
        {replyTo.message || replyTo.fileName || "Attachment"}
      </p>
    </button>
  );
}

const MENU_WIDTH = 192;
const MENU_HEIGHT_ESTIMATE = 260;

export default function Message({
  message,
  self,
  contactName,
  onReply,
  onForward,
  onTogglePin,
  onDelete,
  onReact,
  onJumpToMessage,
  highlighted,
  receiverId,
  receiverOnline,
  contactAvatar,
  showSeenAvatar,
  selectMode,
  selected,
  onToggleSelect,
}) {
  const [contextMenu, setContextMenu] = useState(null); // { x, y } | null
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    if (!contextMenu) return;
    const closeMenu = () => setContextMenu(null);
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [contextMenu]);

  const handleContextMenu = (e) => {
    if (selectMode) return;
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - MENU_WIDTH - 8);
    const y = Math.min(e.clientY, window.innerHeight - MENU_HEIGHT_ESTIMATE - 8);
    setContextMenu({ x: Math.max(8, x), y: Math.max(8, y) });
  };

  const handleMoreClick = (e) => {
    if (selectMode) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8);
    const y = Math.min(rect.bottom + 6, window.innerHeight - MENU_HEIGHT_ESTIMATE - 8);
    setContextMenu({ x: Math.max(8, x), y: Math.max(8, y) });
  };

  const handleRowClick = () => {
    if (selectMode && message._id) onToggleSelect?.(message._id);
  };

  const isSelf = self === message.sender;
  const hasText = Boolean(message.message && message.message.trim());
  const isImageOnly =
    message.fileUrl && message.fileType?.startsWith("image/") && !hasText;
  const isDeleted = message.deletedForEveryone;

  const reactions = message.reactions || [];
  const groupedReactions = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});
  const myReaction = reactions.find((r) => r.uid === self)?.emoji;

  const seenByReceiver = Boolean(receiverId) && (message.seenBy || []).includes(receiverId);
  const tickState = seenByReceiver ? "seen" : receiverOnline ? "delivered" : "sent";

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.message || "");
    setContextMenu(null);
  };

  const handleDeleteClick = () => {
    if (isSelf) {
      setConfirmDelete(true);
      setContextMenu(null);
    } else {
      onDelete?.(message, "me");
      setContextMenu(null);
    }
  };

  if (isDeleted) {
    return (
      <li className={classNames(isSelf ? "justify-end" : "justify-start", "flex")}>
        <div className="italic text-xs text-slate-400 dark:text-slate-500 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center gap-1.5">
          <FiTrash2 size={12} /> This message was deleted
        </div>
      </li>
    );
  }

  return (
    <li
      id={message._id ? `message-${message._id}` : undefined}
      onClick={handleRowClick}
      className={classNames(
        "flex items-end animate-message-in relative gap-2",
        selectMode && "cursor-pointer"
      )}
    >
      {selectMode && (
        <span
          className={classNames(
            "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mb-1",
            selected
              ? "bg-rose-600 border-rose-600"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          )}
        >
          {selected && <FiCheck size={12} className="text-white" />}
        </span>
      )}
      <div
        className={classNames(
          "flex-1 flex",
          isSelf ? "justify-end" : "justify-start"
        )}
      >
      <div
        className={classNames(
          "flex flex-col max-w-[75%] sm:max-w-md relative",
          isSelf ? "items-end" : "items-start"
        )}
      >
        {message.pinned && (
          <span className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 mb-0.5 px-1">
            <BsPinAngleFill size={10} /> Pinned
          </span>
        )}

        <div className="group relative flex items-center gap-1">
          {!selectMode && (
            <button
              type="button"
              onClick={handleMoreClick}
              aria-label="Message options"
              className={classNames(
                "absolute -top-2.5 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 dark:text-slate-300 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition hover:bg-slate-100 dark:hover:bg-slate-700",
                isSelf ? "-left-2.5" : "-right-2.5"
              )}
            >
              <FiChevronDown size={13} />
            </button>
          )}
          {isImageOnly ? (
            <div
              onContextMenu={handleContextMenu}
              className={classNames(
                "rounded-lg",
                highlighted && "animate-highlight-flash"
              )}
            >
              <Attachment message={message} isSelf={isSelf} selectMode={selectMode} />
            </div>
          ) : (
            <div
              onContextMenu={handleContextMenu}
              className={classNames(
                "flex flex-col gap-1.5 px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words",
                isSelf
                  ? "bg-rose-600 dark:bg-rose-700 text-white rounded-br-md"
                  : "bg-rose-400 dark:bg-rose-500 text-white rounded-bl-md",
                highlighted && "animate-highlight-flash"
              )}
            >
              {message.replyTo && typeof message.replyTo === "object" && (
                <ReplyQuote
                  replyTo={{ ...message.replyTo, currentSelf: self }}
                  isSelf={isSelf}
                  contactName={contactName}
                  onJump={onJumpToMessage}
                />
              )}
              {message.fileUrl && <Attachment message={message} isSelf={isSelf} selectMode={selectMode} />}
              {hasText && <span>{message.message}</span>}
            </div>
          )}

          {/* Right-click context menu */}
          {contextMenu && (
            <div
              ref={menuRef}
              style={{ position: "fixed", left: contextMenu.x, top: contextMenu.y }}
              className="w-48 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-panel-in"
            >
              <div className="flex items-center justify-around px-2 py-1.5 border-b border-slate-100 dark:border-slate-700">
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact?.(message, emoji);
                      setContextMenu(null);
                    }}
                    className="text-base hover:scale-125 transition active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  onReply?.(message);
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <FiCornerUpLeft size={14} /> Reply
              </button>
              {hasText && (
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  <FiCopy size={14} /> Copy
                </button>
              )}
              <button
                onClick={() => {
                  onForward?.(message);
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <FiShare2 size={14} /> Forward
              </button>
              <button
                onClick={() => {
                  onTogglePin?.(message);
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                {message.pinned ? (
                  <BsPinAngleFill size={14} />
                ) : (
                  <BsPinAngle size={14} />
                )}
                {message.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {Object.keys(groupedReactions).length > 0 && (
          <div
            className={classNames(
              "flex gap-1 -mt-2 mb-0.5 z-[1]",
              isSelf ? "mr-1" : "ml-1"
            )}
          >
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact?.(message, emoji)}
                className={classNames(
                  "flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full border shadow-sm transition",
                  myReaction === emoji
                    ? "bg-rose-50 dark:bg-rose-900/40 border-rose-300 dark:border-rose-700"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                )}
              >
                <span>{emoji}</span>
                {count > 1 && (
                  <span className="text-slate-500 dark:text-slate-400">{count}</span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-0.5 px-1">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {formatMessageTime(message.createdAt)}
          </span>
          {isSelf && (
            <span title={tickState === "seen" ? "Seen" : tickState === "delivered" ? "Delivered" : "Sent"}>
              {tickState === "sent" ? (
                <BsCheck2 size={14} className="text-slate-400 dark:text-slate-500" />
              ) : tickState === "delivered" ? (
                <BsCheck2All size={14} className="text-slate-400 dark:text-slate-500" />
              ) : (
                <BsCheck2All size={14} className="text-rose-500 dark:text-rose-400" />
              )}
            </span>
          )}
        </div>

        {isSelf && tickState === "seen" && showSeenAvatar && contactAvatar && (
          <div className="flex justify-end px-1 -mt-0.5">
            <img
              src={contactAvatar}
              alt="Seen"
              className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-white dark:ring-slate-900"
            />
          </div>
        )}
      </div>
      </div>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">
              Delete message?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onDelete?.(message, "everyone");
                  setConfirmDelete(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                Delete for everyone
              </button>
              <button
                onClick={() => {
                  onDelete?.(message, "me");
                  setConfirmDelete(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Delete for me
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full text-center px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
