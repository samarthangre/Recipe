import React from "react";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  const baseClasses =
    "inline-block p-3 my-2 break-words rounded-2xl";
  const botClasses = "bg-gray-200 text-black self-start rounded-tl-none";
  const userClasses = "bg-yellow-300 text-black self-end rounded-tr-none";
  const errorClasses = "bg-red-500 text-white";

  const messageClasses = `${baseClasses} ${
    chat.role === "assistant" ? botClasses : userClasses
  } ${chat.isError ? errorClasses : ""}`;

  return (
    <div className={`flex ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}>
      <div className={messageClasses}>
        <p>{chat.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
