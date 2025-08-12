import React, { useRef } from "react";
import { FaArrowUp } from "react-icons/fa";

export const ChatForm = ({
  setChatHistory,
  generateBotResponse,
  chatHistory,
}) => {
  const inputRef = useRef();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // update chat history with the user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(
      () => {
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Thinking..." },
        ]);
      },
      generateBotResponse([
        ...chatHistory,
        { role: "user", text: userMessage },
      ]),
      600
    );
  };
  return (
    <form className="askInput" onSubmit={handleFormSubmit} action="">
      <input ref={inputRef} placeholder="Ask Chatbot..." required type="text" />
      <button>
        <FaArrowUp />
      </button>
    </form>
  );
};
