import React from "react";
import { ChatbotIcons } from "../chatbotIcons/ChatbotIcons";

export const ChatMessage = ({chat}) => {
  return (
    <div className={` ${chat.role === 'user'? 'chat-message-2' : 'chat-message ' } ${chat.showError && 'error'}`}>
      {chat.role == 'model' && <ChatbotIcons/>}
      <p>
        {chat.text}
      </p>
    </div>
  );
};
