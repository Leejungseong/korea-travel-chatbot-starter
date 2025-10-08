import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Chatbot.css";

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([{ sender: "bot", text: t("welcome") }]);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  // 언어가 바뀌면 초기 환영 메시지를 갱신 (기존 대화 유지되길 원하면 이 부분 조정)
  useEffect(() => {
    setMessages([{ sender: "bot", text: t("welcome") }]);
  }, [t, i18n.language]);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setInput("");

    // 테스트용 자동 응답 (나중에 서버 호출로 대체)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: t("auto_reply") }]);
    }, 700);
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.sender === "bot" ? "bot" : "user"}`}>
            <strong>{m.sender === "bot" ? t("label_bot") : t("label_user")}</strong> {m.text}
          </div>
        ))}
        <div ref={messagesRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          aria-label="message-input"
        />
        <button type="submit">{t("send")}</button>
      </form>
    </div>
  );
}
