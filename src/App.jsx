
import { ChatbotIcons } from "./components/chatbotIcons/ChatbotIcons";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { ChatForm } from "./components/ChatForm/ChatForm";
import { ChatMessage } from "./components/ChatMessage/ChatMessage";
import { useEffect, useRef, useState } from "react";
import { IoChatboxSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

function App() {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(true);

  const [chatHistory, setChatHistory] = useState([]);
  const generateBotResponse = async (history) => {
    // update chat history with bot response more cleanly
    const updateChatHistory = (text, showError=false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, showError },
      ]);
    };
    // setting the text just like google wanted
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message);
      }
      // get the api response more cleanly
      const apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateChatHistory(apiResponse);
    } catch (error) {
      updateChatHistory(error.message, true)
    }
  };
  // scroll smoothly to bottom
  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <>
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button
          onClick={() => setShowChatbot((prev) => !prev)}
          className="popupToggler"
        >
          {showChatbot ? (
            <span>
              <RxCross1 />
            </span>
          ) : (
            <span>
              <IoChatboxSharp />
            </span>
          )}
        </button>
        <div className="chatbot-popup">
          {/* chatbot header */}
          <div className="chat-header">
            <div className="header-info">
              <div>
                <ChatbotIcons />
                <h2 className="logo-text">Chatbot</h2>
              </div>
              <button onClick={() => setShowChatbot(prev => !prev)}>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
          </div>
          <div ref={chatBodyRef} className="chat-body">
            <div className="chat-message">
              <ChatbotIcons />
              <p>Hi there! how can I help you?</p>
            </div>
            {chatHistory.map((chat, idx) => (
              <ChatMessage key={idx} chat={chat} />
            ))}
          </div>
          <div className="chat-footer">
            <ChatForm
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
              chatHistory={chatHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
