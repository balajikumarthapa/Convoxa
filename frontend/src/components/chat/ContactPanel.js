import { useState, useEffect, useMemo } from "react";
import { FiX, FiBellOff, FiTrash2, FiImage, FiFileText, FiDownload } from "react-icons/fi";

import { getUser } from "../../services/ChatService";
import { FileIcon, Lightbox } from "./Message";

const SERVER_URL = "https://convoxa-server.onrender.com";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ContactPanel({
  open,
  onClose,
  chatRoom,
  currentUser,
  onlineUsersId,
  messages = [],
}) {
  const [contact, setContact] = useState();
  const [tab, setTab] = useState("media"); // "media" | "files"
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    if (!chatRoom) return;

    const contactId = chatRoom.members?.find(
      (member) => member !== currentUser.uid
    );

    const fetchData = async () => {
      const res = await getUser(contactId);
      setContact(res);
    };

    fetchData();
  }, [chatRoom, currentUser]);

  const isOnline = onlineUsersId?.includes(contact?.uid);

  const attachments = useMemo(
    () => (messages || []).filter((m) => m.fileUrl),
    [messages]
  );
  const mediaItems = attachments.filter((m) => m.fileType?.startsWith("image/"));
  const fileItems = attachments.filter((m) => !m.fileType?.startsWith("image/"));

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-10 sm:hidden bg-black/30"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`absolute top-0 right-0 z-20 h-full w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-200 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            Profile
          </p>
          <button
            onClick={onClose}
            aria-label="Close profile panel"
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
          <div className="flex flex-col items-center px-6 py-8 border-b border-slate-200 dark:border-slate-800">
            <img
              className="w-20 h-20 rounded-full object-cover bg-slate-200 dark:bg-slate-700 mb-3 ring-4 ring-slate-50 dark:ring-slate-800/60"
              src={contact?.photoURL}
              alt=""
            />
            <p className="font-semibold text-lg tracking-[-0.01em] text-slate-800 dark:text-slate-100">
              {contact?.displayName}
            </p>
            <p
              className={`text-sm mt-0.5 ${
                isOnline
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>

          <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
              Shared media
            </p>

            <div className="flex gap-1 mb-3 bg-slate-100 dark:bg-slate-800/60 rounded-lg p-1">
              <button
                onClick={() => setTab("media")}
                className={classNames(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition",
                  tab === "media"
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <FiImage size={13} /> Media ({mediaItems.length})
              </button>
              <button
                onClick={() => setTab("files")}
                className={classNames(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition",
                  tab === "files"
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                <FiFileText size={13} /> Files ({fileItems.length})
              </button>
            </div>

            {tab === "media" ? (
              mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5 pb-4">
                  {mediaItems.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxSrc(SERVER_URL + m.fileUrl)}
                      className="aspect-square rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 hover:opacity-80 active:scale-95 transition"
                    >
                      <img
                        src={SERVER_URL + m.fileUrl}
                        alt={m.fileName || "shared media"}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 pb-4">
                  No media shared yet
                </p>
              )
            ) : fileItems.length > 0 ? (
              <div className="flex flex-col gap-1.5 pb-4">
                {fileItems.map((m, i) => (
                  <a
                    key={i}
                    href={SERVER_URL + m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={m.fileName}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <FileIcon
                      fileName={m.fileName}
                      fileType={m.fileType}
                      className="shrink-0 text-slate-500 dark:text-slate-400"
                    />
                    <span className="truncate text-xs font-medium flex-1 text-slate-700 dark:text-slate-200">
                      {m.fileName}
                    </span>
                    <FiDownload size={13} className="shrink-0 opacity-60" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 pb-4">
                No files shared yet
              </p>
            )}
          </div>

          <div className="p-2">
            <button
              onClick={() => alert("🔔 Mute notifications — coming soon!")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-[0.98] transition"
            >
              <FiBellOff size={17} /> Mute notifications
            </button>
            <button
              onClick={() => alert("🗑️ Delete chat — coming soon!")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition"
            >
              <FiTrash2 size={17} /> Delete chat
            </button>
          </div>
        </div>
      </div>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} alt="" onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}
