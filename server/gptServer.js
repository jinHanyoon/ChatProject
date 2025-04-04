import express from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://chat-project-wheat.vercel.app', 'http://localhost:3000'],  // 클라이언트 도메인 추가
  methods: ['GET', 'POST', 'OPTIONS'],  // OPTIONS 메서드 추가
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());
const PORT = process.env.PORT || 10001;


const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

app.post('/send-gpt', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      
      messages: [
        { role: "system",
      content: "Summarize the following conversation in Korean, focusing on the overall message flow.  Do not list each message separately unless it's important.  Briefly describe what kind of messages were exchanged, even if they were trivial or test messages.  Then explain the purpose or intent of the conversation in a natural and coherent way.  If there are any meaningful conclusions, decisions, or TODO items, list them clearly at the end.  Avoid overly short summaries that omit useful context."
        },
        { role: "user", content: message }]
    });
    console.log('메시지 전송 성공',completion);

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API 에러:', error.message);
    res.status(500).json({ error: '서버 에러' });
  }
});

app.listen(PORT, () => {
  console.log('서버가 3002 포트에서 실행 중입니다.');
});