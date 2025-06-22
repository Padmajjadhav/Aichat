export default async function handler(req, res) {
  const { provider, prompt } = req.body;

  const OPENAI_KEY = process.env.OPENAI_KEY;
  const GOOGLE_KEY = process.env.GOOGLE_KEY;

  try {
    let response;
    if (provider === "openai") {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        })
      });
    } else {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage?key=${GOOGLE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: { messages: [{ author: "user", content: prompt }] }
          })
        }
      );
    }

    const data = await response.json();
    const reply =
      provider === "openai"
        ? data.choices?.[0]?.message?.content
        : data.candidates?.[0]?.content;

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}