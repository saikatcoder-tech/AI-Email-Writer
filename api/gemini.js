// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  const { prompt } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
}
