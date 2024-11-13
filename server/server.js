import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Start a chat session with Google Gemini API
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the user's prompt to the chat session
    const result = await chatSession.sendMessage(prompt);

    // Send the generated response back to the client
    res.status(200).send({
      bot: result.response.text(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong with the chatbot' });
  }
});

app.listen(5000, () => console.log('Chatbot server started on http://localhost:5000'));
