const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(buffers).toString());

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(body.prompt);
    const output = result.response.text();

    res.status(200).json({ response: output });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
};
