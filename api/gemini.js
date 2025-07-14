const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Parse JSON body if not already parsed
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const prompt = data.prompt;

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const output = result.response.text();

      res.status(200).json({ response: output });
    } catch (err) {
      console.error("Gemini Error:", err);
      res.status(500).json({ error: "Gemini failed" });
    }
  });
};
