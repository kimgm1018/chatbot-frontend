import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import "./App.css";

function App() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userId = "user123";

    // 내 메시지 추가
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: input }),
      });
      const data = await response.json();

      // 봇 메시지 추가
      setMessages((prev) => [...prev, { from: "bot", text: data.answer }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <motion.div
        className={`chatbox ${open ? "open" : ""}`}
        onClick={() => !open && setOpen(true)}
        animate={{
          width: open ? 300 : 70,
          height: open ? 400 : 70,
          borderRadius: open ? "12px" : "50%",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
      >
        {!open ? (
          <span className="chat-label">SPMED<br></br>도움이</span>
        ) : (
          <div className="chatbot-popup">
            <div className="chatbot-header">
              <span>🤖 SPMED 도움이</span>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>
            <div className="chatbot-body">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.from}>
                  <b>{msg.from === "user" ? "나" : "봇"}:</b> <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="chatbot-footer">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 페이지 새로고침 방지
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default App;