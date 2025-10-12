import React, { useEffect } from "react";
import { AdMob } from "@capacitor-community/admob";

const BannerAd = () => {
  useEffect(() => {
    // 실제 광고 로드 (Android에서만 작동)
    const loadBanner = async () => {
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: true, // 실제 광고 시 false
        });

        await AdMob.showBanner({
          adId: "ca-app-pub-1326xxxxxxxxxxxxxxx", // 선생님의 광고 단위 ID로 교체
          adSize: "BANNER",
          position: "BOTTOM_CENTER",
          margin: 0,
        });
      } catch (error) {
        console.error("AdMob Banner Error:", error);
      }
    };

    loadBanner();

    // 언마운트 시 광고 제거
    return () => {
      AdMob.removeBanner();
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px",
        background: "#fafafa",
        color: "#888",
        fontSize: "14px",
      }}
    >
      광고가 표시되는 영역입니다
    </div>
  );
};

export default BannerAd;
