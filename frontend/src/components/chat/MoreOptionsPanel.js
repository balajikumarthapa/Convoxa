import { useState } from "react";
import { FiX, FiStar, FiBellOff, FiSlash, FiTrash2, FiCheckSquare } from "react-icons/fi";

function Toggle({ on }) {
  return (
    <span
      className={`w-9 h-5 rounded-full transition relative shrink-0 ${
        on ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      ></span>
    </span>
  );
}

function Row({ icon, label, danger, onClick, right, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {right}
    </button>
  );
}

export default function MoreOptionsPanel({
  open,
  onClose,
  onClearChat,
  isFavourite,
  isMuted,
  isBlocked,
  onToggleFavourite,
  onToggleMute,
  onToggleBlock,
  onSelectMessages,
}) {
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleBlockClick = () => {
    if (isBlocked) {
      onToggleBlock();
    } else {
      setConfirmBlock(true);
    }
  };

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
            Chat options
          </p>
          <button
            onClick={onClose}
            aria-label="Close options panel"
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-2">
          <Row
            icon={<FiCheckSquare size={17} />}
            label="Select messages"
            onClick={() => {
              onSelectMessages();
              onClose();
            }}
          />

          <Row
            icon={
              <FiStar size={17} className={isFavourite ? "text-yellow-500" : ""} />
            }
            label="Add to favourites"
            onClick={onToggleFavourite}
            right={<Toggle on={isFavourite} />}
          />

          <Row
            icon={<FiBellOff size={17} />}
            label="Mute notifications"
            onClick={onToggleMute}
            right={<Toggle on={isMuted} />}
          />

          <Row
            icon={<FiSlash size={17} />}
            label={isBlocked ? "Unblock user" : "Block user"}
            danger
            onClick={handleBlockClick}
          />

          <Row
            icon={<FiTrash2 size={17} />}
            label="Clear chat"
            danger
            onClick={() => setConfirmClear(true)}
          />
        </div>
      </div>

      {confirmBlock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmBlock(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-1">
              Block this user?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              They won't be able to send you messages, and you won't be able to
              send them any either, until you unblock.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onToggleBlock();
                  setConfirmBlock(false);
                }}
                className="w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                Block
              </button>
              <button
                onClick={() => setConfirmBlock(false)}
                className="w-full text-center px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmClear(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4"
          >
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-1">
              Clear this chat?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              All messages will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onClearChat();
                  setConfirmClear(false);
                  onClose();
                }}
                className="w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                Clear chat
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="w-full text-center px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
