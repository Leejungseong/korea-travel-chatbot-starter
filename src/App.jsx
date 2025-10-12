import React, { useState, useEffect } from "react";
import { AdMob, BannerAdSize } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [adStatus, setAdStatus] = useState("idle"); // idle | init | loading | loaded | failed
  const [adError, setAdError] = useState("");

  // ✅ AdMob 이벤트 리스너 등록
  useEffect(() => {
    const listeners = [
      AdMob.addListener("bannerAdLoaded", () => {
        setAdStatus("loaded");
        setAdError("");
        console.log("✅ bannerAdLoaded");
      }),
      AdMob.addListener("bannerAdFailedToLoad", (err) => {
        setAdStatus("failed");
        setAdError(JSON.stringify(err));
        console.warn("❌ bannerAdFailedToLoad:", err);
      }),
      AdMob.addListener("bannerAdClicked", () => {
        console.log("ℹ️ bannerAdClicked");
      }),
    ];

    return () => listeners.forEach((l) => l.remove());
  }, []);

  // ✅ 앱 실행 시 AdMob 초기화 및 배너 표시
  useEffect(() => {
    (async () => {
      try {
        setAdStatus("init");
        await AdMob.initialize();
        console.log("✅ AdMob initialized");

        if (Capacitor.getPlatform() === "android") {
          setAdStatus("loading");
          await AdMob.showBanner({
            adId: "ca-app-pub-3940256099942544/6300978111", // 테스트용 ID
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: "BOTTOM_CENTER",
            margin: 0,
          });
          console.log("📢 Banner ad request sent");
        } else {
          console.log("💡 웹 환경에서는 실제 광고가 표시되지 않습니다.");
        }
      } catch (e) {
        setAdStatus("failed");
        setAdError(String(e?.message || e));
        console.error("❌ AdMob error:", e);
      }
    })();
  }, []);

  const changeLang = (e) => i18n.changeLanguage(e.target.value);

  const handleSend = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.reply || "응답이 없습니다.");
    } catch (err) {
      setResponse("네트워크 오류: " + err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#faebd7",
        paddingBottom: "70px", // 광고 오버레이 대비 여백
        boxSizing: "border-box",
      }}
    >
      {/* 상단 영역 */}
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>더피 – 여행 가이드 챗봇</h1>

        {/* 언어 선택 */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
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

        {/* 메시지 입력 */}
        <input
          type="text"
          placeholder="질문을 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button onClick={handleSend}>보내기</button>

        {/* 응답 */}
        <div style={{ marginTop: "20px" }}>
          <strong>응답:</strong> {response}
        </div>
      </div>

      {/* ✅ 광고 상태 및 예약 영역 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60px",
          background: "#f1f1f1",
          borderTop: "1px solid #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#444",
          fontSize: "12px",
          zIndex: 100,
        }}
      >
        {Capacitor.getPlatform() !== "android" ? (
          <>💻 웹 환경: 광고는 실제 표시되지 않습니다.</>
        ) : adStatus === "loaded" ? (
          <>📱 광고가 정상적으로 로드되어 하단에 표시 중입니다.</>
        ) : adStatus === "loading" ? (
          <>⏳ 광고 로딩 중... (잠시만 기다려 주세요)</>
        ) : adStatus === "failed" ? (
          <>❌ 광고 로드 실패 — {adError || "에러 확인 필요"}</>
        ) : adStatus === "init" ? (
          <>🔄 AdMob 초기화 중...</>
        ) : (
          <>⚪ 광고 대기 중</>
        )}
      </div>
    </div>
  );
}

export default App;
