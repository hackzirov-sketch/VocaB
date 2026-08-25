async function testGroq() {
  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: "Say hello" }],
          temperature: 0.7,
        }),
      }
    );
    const data = await res.json();
    console.log("Groq openai/gpt-oss-20b:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Groq error:", e.message);
  }
}

async function testGemini() {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [{ role: "user", content: "Say hello" }],
          temperature: 0.7,
        }),
      }
    );
    const data = await res.json();
    console.log("Gemini 2.5-flash:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Gemini error:", e.message);
  }
}

async function testGemini35() {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "gemini-3.5-flash-lite",
          messages: [{ role: "user", content: "Say hello" }],
          temperature: 0.7,
        }),
      }
    );
    const data = await res.json();
    console.log("Gemini 3.5-flash-lite:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Gemini 3.5 error:", e.message);
  }
}

testGroq();
testGemini();
testGemini35();
