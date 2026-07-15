import { useState, useEffect, useRef } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { EmojiHappyIcon, PaperClipIcon, XIcon } from "@heroicons/react/outline";
import Picker from "emoji-picker-react";

import { uploadFile } from "../../services/ChatService";

export default function ChatForm(props) {
  const { replyingTo, onCancelReply } = props;
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const scrollRef = useRef();
  const fileInputRef = useRef();
  const typingTimeoutRef = useRef();
  const messageInputRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [showEmojiPicker]);

  useEffect(() => {
    if (replyingTo) messageInputRef.current?.focus();
  }, [replyingTo]);

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  const handleEmojiClick = (event, emojiObject) => {
    let newMessage = message + emojiObject.emoji;
    setMessage(newMessage);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    props.onTyping?.();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      props.onStopTyping?.();
    }, 1500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    clearTimeout(typingTimeoutRef.current);
    props.onStopTyping?.();

    props.handleFormSubmit({
      message,
      replyTo: replyingTo?._id || null,
    });
    setMessage("");
    onCancelReply?.();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large. Max size is 15MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res) {
        props.handleFormSubmit({
          message: "",
          fileUrl: res.fileUrl,
          fileName: res.fileName,
          fileType: res.fileType,
          replyTo: replyingTo?._id || null,
        });
        onCancelReply?.();
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      ref={scrollRef}
      className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
    >
      {showEmojiPicker && (
        <div className="absolute bottom-full left-3 mb-2 z-30 rounded-xl overflow-hidden shadow-2xl">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {replyingTo && (
        <div className="flex items-center justify-between gap-2 mb-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-l-4 border-rose-500">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {replyingTo.senderName || "Replying to"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {replyingTo.message || replyingTo.fileName || "Attachment"}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="shrink-0 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className={`shrink-0 p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
            showEmojiPicker
              ? "text-rose-600 dark:text-rose-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <EmojiHappyIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current.click()}
          title="Attach file"
          className="shrink-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
        >
          <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <input
          ref={messageInputRef}
          type="text"
          placeholder={uploading ? "Uploading file..." : "Write a message"}
          disabled={uploading}
          className="block w-full py-2.5 px-4 outline-none bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-rose-500 dark:focus:border-rose-500 text-slate-900 dark:text-white text-sm rounded-full placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60"
          name="message"
          value={message}
          onChange={handleMessageChange}
        />

        <button
          type="submit"
          disabled={!message.trim() || uploading}
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:hover:bg-rose-500 disabled:cursor-not-allowed text-white transition"
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}