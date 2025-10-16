import React, { useState, useEffect } from "react";
import { AdMob, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";

function App() {
  const [language, setLanguage] = useState("ko");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // ✅ AdMob 초기화
  useEffect(() => {
    const initAdMob = async () => {
      await AdMob.initialize();
      await AdMob.showBanner({
        adId: "ca-app-pub-1332603985253339/7390309623", // 테스트용 광고 ID
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 28, // 하단에서 안전하게 띄움
      });
    };
    initAdMob();
  }, []);

  // ✅ 언어별 응답 샘플
  const responses = {
    ko: "안녕하세요! 한국 여행에 대해 무엇이든 물어보세요.",
    en: "Hello! Ask me anything about traveling in Korea.",
    ja: "こんにちは！韓国旅行について何でも聞いてください。",
    zh: "你好！关于韩国旅游，随便问我吧。",
    es: "¡Hola! Pregúntame lo que quieras sobre viajar en Corea.",
    fr: "Bonjour ! Demandez-moi n'importe quoi sur le voyage en Corée.",
    de: "Hallo! Fragen Sie mich alles über Reisen in Korea.",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswer(responses[language]);
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#fae7c8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "6vh",
        paddingBottom: "80px", // 배너 영역 확보
        boxSizing: "border-box",
      }}
    >
      {/* ✅ 제목 */}
      <h1
        style={{
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)", // 반응형 크기 자동 조정
          fontWeight: "bold",
          whiteSpace: "nowrap", // 한 줄 고정
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        더피 – 여행 가이드 챗봇
      </h1>

      {/* ✅ 언어 선택 */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          fontSize: "1rem",
          marginBottom: "10px",
          padding: "6px 10px",
          borderRadius: "6px",
        }}
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>

      {/* ✅ 입력창 */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #888",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 25px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#f4f4f4",
            cursor: "pointer",
          }}
        >
          보내기
        </button>
      </form>

      {/* ✅ 응답 영역 */}
      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <p>응답: {answer}</p>
      </div>

      {/* ✅ 광고 환경 표시 */}
      <p
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#555",
          paddingBottom: "4px",
        }}
      >
        💻 웹 환경: 광고는 실제 표시되지 않습니다.
      </p>
    </div>
  );
}

export default App;
