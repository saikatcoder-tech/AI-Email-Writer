const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  // Make sure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse the request body (Vercel uses req.body directly)
  let prompt = '';
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    const parsed = JSON.parse(rawBody);
    prompt = parsed.prompt;
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  // API key from environment variable
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment variables' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    return res.status(200).json({ response: output });
  } catch (err) {
    console.error('Gemini Error:', err);
    return res.status(500).json({ error: 'Gemini API failed to generate content' });
  }
};
