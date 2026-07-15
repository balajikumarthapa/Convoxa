import { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";

import Contact from "./Contact";

export default function ForwardModal({
  message,
  extraCount = 0,
  chatRooms,
  currentChatId,
  currentUser,
  onlineUsersId,
  onClose,
  onConfirm,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);

  const candidates = (chatRooms || []).filter(
    (room) => room._id !== currentChatId
  );

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) return;
    setSending(true);
    const targets = candidates.filter((room) => selectedIds.includes(room._id));
    await onConfirm(targets);
    setSending(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            Forward message
          </p>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 truncate border-b border-slate-100 dark:border-slate-700/60">
          {message?.message || message?.fileName || "Attachment"}
          {extraCount > 0 && ` (+${extraCount} more)`}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin py-1">
          {candidates.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">
              No other chats to forward to
            </p>
          )}
          {candidates.map((room) => {
            const isSelected = selectedIds.includes(room._id);
            return (
              <div
                key={room._id}
                onClick={() => toggle(room._id)}
                className="flex items-center gap-3 mx-2 my-0.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
              >
                <div className="flex-1 min-w-0">
                  <Contact
                    chatRoom={room}
                    onlineUsersId={onlineUsersId}
                    currentUser={currentUser}
                  />
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-rose-600 border-rose-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {isSelected && <FiCheck size={12} className="text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSend}
            disabled={selectedIds.length === 0 || sending}
            className="w-full py-2 rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition"
          >
            {sending
              ? "Sending..."
              : `Send${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
