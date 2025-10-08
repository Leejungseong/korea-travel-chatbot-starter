import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const changeLang = (e) => i18n.changeLanguage(e.target.value);
  const handleSend = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
      const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message }),
});


      const data = await response.json();

      if (data.error) {
        setResponse("에러 발생: " + data.error.message);
      } else if (data.choices && data.choices.length > 0) {
        // OpenAI API 직접 호출 시
        setResponse(data.choices[0].message.content);
      } else if (data.reply) {
        // 서버에서 reply로 응답한 경우
        setResponse(data.reply);
      } else {
        setResponse("응답 형식을 알 수 없습니다.");
      }
    } catch (err) {
      setResponse("네트워크 오류: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#faebd7", height: "100vh" }}>
      

      <h1>더피 – 여행 가이드 챗봇</h1>
      {/* 언어 선택 드롭다운 */}
<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
  <select value={i18n.language} onChange={changeLang}>
    <option value="ko">한국어</option>
    <option value="en">English</option>
    <option value="ja">日本語</option>
    <option value="zh">中文</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
    <option value="vi">Tiếng Việt</option>
  </select>
</div>
      <input
        type="text"
        placeholder="질문을 입력하세요"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSend}>보내기</button>
      <div style={{ marginTop: "20px" }}>
        <strong>응답:</strong> {response}
      </div>
    </div>
  );
}

export default App;
