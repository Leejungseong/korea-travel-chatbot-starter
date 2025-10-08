import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- 환경 변수 불러오기 ----
// ---- 환경 변수 불러오기 ----
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const COST_PER_CALL_WON = Number(process.env.COST_PER_CALL_WON || 7);
const REWARD_REVENUE_WON = Number(process.env.REWARD_REVENUE_WON || 5);
const USER_DAILY_LIMIT = Number(process.env.USER_DAILY_LIMIT || 15);
const GLOBAL_DAILY_BUDGET_WON = Number(process.env.GLOBAL_DAILY_BUDGET_WON || 5000);

// ---- 상태 저장용 변수 (임시 메모리) ----
let totalSpent = 0;
let userUsage = {}; // { "userIP": 호출횟수 }

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const userIP = req.ip || req.headers["x-forwarded-for"] || "unknown";

  // 1️⃣ 전체 예산 초과 방지
  if (totalSpent >= GLOBAL_DAILY_BUDGET_WON) {
    return res.status(429).json({ error: "서버 예산 한도 초과. 잠시 후 다시 시도해주세요." });
  }

  // 2️⃣ 사용자별 호출 제한
  userUsage[userIP] = (userUsage[userIP] || 0) + 1;
  if (userUsage[userIP] > USER_DAILY_LIMIT) {
    return res.status(429).json({ error: "1일 호출 한도 초과." });
  }

  // 3️⃣ OpenAI API 요청
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    // 4️⃣ 비용 누적 계산
    totalSpent += COST_PER_CALL_WON;

    res.json({
      reply: data.choices?.[0]?.message?.content || "응답을 불러올 수 없습니다.",
      totalSpent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ 비용 가드 서버 실행 중: http://localhost:${PORT}`);
});
