const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(req.body.prompt);
    const output = result.response.text();
    res.status(200).json({ response: output });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
};
