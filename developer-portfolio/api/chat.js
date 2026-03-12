export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array in body" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error:
        "Missing GROQ_API_KEY. Set it in Vercel Project → Settings → Environment Variables.",
    });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "llama-3.3-70b-versatile",
        }),
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "Groq returned non-JSON",
        details: text.slice(0, 200),
      });
    }

    if (!response.ok) {
      const errMsg =
        data.error?.message || data.error || `Groq HTTP ${response.status}`;
      return res.status(502).json({ error: errMsg, details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
}
