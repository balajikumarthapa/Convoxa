import { useState, useEffect } from "react";
import { FiStar, FiBellOff, FiMessageSquare } from "react-icons/fi";

import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
import UserLayout from "../layouts/UserLayout";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ContactSkeleton() {
  return (
    <li className="mx-2 my-0.5 px-3 py-2.5 rounded-xl flex items-center gap-3">
      <div className="w-10 h-10 rounded-full skeleton shrink-0"></div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="h-3 w-2/3 rounded skeleton"></div>
        <div className="h-2.5 w-1/3 rounded skeleton"></div>
      </div>
    </li>
  );
}

function ChatRoomItem({ chatRoom, isSelected, isMuted, isFavourite, onClick, onlineUsersId, currentUser }) {
  return (
    <li
      className={classNames(
        "mx-2 my-0.5 px-3 py-2.5 rounded-xl cursor-pointer transition active:scale-[0.98] flex items-center gap-2",
        isSelected
          ? "bg-rose-600/15 border border-rose-600/30"
          : "border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60"
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <Contact
          chatRoom={chatRoom}
          onlineUsersId={onlineUsersId}
          currentUser={currentUser}
          showPreview
          isActive={isSelected}
        />
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isFavourite && <FiStar size={13} className="text-rose-400 fill-rose-400" />}
        {isMuted && <FiBellOff size={13} className="text-slate-500" />}
      </div>
    </li>
  );
}

export default function AllUsers({
  users,
  chatRooms,
  setChatRooms,
  onlineUsersId,
  currentUser,
  changeChat,
  loading = false,
}) {
  const [selectedChatId, setSelectedChatId] = useState();
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);

  useEffect(() => {
    if (!chatRooms) return;

    const Ids = chatRooms.map((chatRoom) => {
      return chatRoom.members.find((member) => member !== currentUser.uid);
    });

    setContactIds(Ids);
  }, [chatRooms, currentUser.uid]);

  useEffect(() => {
    if (!users) return;

    setNonContacts(
      users.filter(
        (f) => f.uid !== currentUser.uid && !contactIds.includes(f.uid)
      )
    );
  }, [contactIds, users, currentUser.uid]);

  const changeCurrentChat = (chat) => {
    setSelectedChatId(chat._id);
    changeChat(chat);
  };

  const handleNewChatRoom = async (user) => {
    const members = {
      senderId: currentUser.uid,
      receiverId: user.uid,
    };
    const res = await createChatRoom(members);
    setChatRooms((prev) => [...prev, res]);
    changeChat(res);
  };

  const favouriteRooms = (chatRooms || []).filter((room) =>
    room.favouritedBy?.includes(currentUser.uid)
  );
  const regularRooms = (chatRooms || []).filter(
    (room) => !room.favouritedBy?.includes(currentUser.uid)
  );

  if (loading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin py-2">
        <p className="px-4 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Chats
        </p>
        <ul>
          {[0, 1, 2, 3, 4].map((i) => (
            <ContactSkeleton key={i} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin py-2">
      {favouriteRooms.length > 0 && (
        <>
          <p className="px-4 pt-2 pb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Favourites
          </p>
          <ul>
            {favouriteRooms.map((chatRoom) => (
              <ChatRoomItem
                key={chatRoom._id}
                chatRoom={chatRoom}
                isSelected={chatRoom._id === selectedChatId}
                isMuted={chatRoom.mutedBy?.includes(currentUser.uid)}
                isFavourite
                onClick={() => changeCurrentChat(chatRoom)}
                onlineUsersId={onlineUsersId}
                currentUser={currentUser}
              />
            ))}
          </ul>
        </>
      )}

      <p className="px-4 pt-4 pb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        Chats
      </p>
      <ul>
        {regularRooms.map((chatRoom) => (
          <ChatRoomItem
            key={chatRoom._id}
            chatRoom={chatRoom}
            isSelected={chatRoom._id === selectedChatId}
            isMuted={chatRoom.mutedBy?.includes(currentUser.uid)}
            isFavourite={false}
            onClick={() => changeCurrentChat(chatRoom)}
            onlineUsersId={onlineUsersId}
            currentUser={currentUser}
          />
        ))}
        {(!chatRooms || chatRooms.length === 0) && (
          <li className="flex flex-col items-center text-center gap-2 px-4 py-8 text-slate-400 dark:text-slate-500">
            <FiMessageSquare size={28} className="opacity-50" />
            <span className="text-sm">
              No conversations yet — pick someone below to start chatting
            </span>
          </li>
        )}
      </ul>

      <p className="px-4 pt-4 pb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        Other users
      </p>
      <ul>
        {(nonContacts || []).map((nonContact, index) => (
          <li
            key={index}
            className="mx-2 my-0.5 px-3 py-2.5 rounded-xl cursor-pointer border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-[0.98] transition"
            onClick={() => handleNewChatRoom(nonContact)}
          >
            <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
          </li>
        ))}
      </ul>
    </div>
  );
}
