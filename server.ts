import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'NEXUS DESK',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Server-side Gemini AI Assistant endpoint
app.post('/api/gemini/assist', async (req: Request, res: Response) => {
  try {
    const { context, prompt, language = 'english', metadata } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please check Settings > Secrets.',
      });
      return;
    }

    // Context-specific system instruction
    let systemInstruction = '';
    const langRule = language === 'hinglish' 
      ? 'Explain clearly using natural, conversational Hinglish (Hindi written in Roman English script mixed with English technical terms). Make it friendly, engaging, and easy to grasp for an Indian student.'
      : 'Explain clearly and professionally in English.';

    if (context === 'study') {
      systemInstruction = `You are the NEXUS Study Companion, an expert tutor for CBSE Class 12 (Physics, Chemistry, Mathematics, Informatics Practices, Painting) and higher education.
${langRule}
Provide clear, step-by-step conceptual explanations, formulas, NCERT key points, exam tips, and practice questions.
If asked about mistakes, explain why the mistake happened and how to solve it correctly.
Do not hallucinate syllabus outside CBSE 12 unless explicitly requested. Structure with clean markdown headings and bullet points.`;
    } else if (context === 'productivity') {
      systemInstruction = `You are the NEXUS Productivity Coach, a smart planner for daily routines, study timetables, and task prioritization.
${langRule}
Help the user break down big chapters into realistic 45-minute study blocks, structure daily agendas, balance board prep with content creation, and review weekly progress.
CRITICAL RULE: Any schedule changes or task suggestions you provide must be clearly formatted as suggestions so the student can review and approve them before applying.`;
    } else if (context === 'creator') {
      systemInstruction = `You are the NEXUS Creator Strategist, assisting with the YouTube channel "High-tech gamer" and blogs "NOVENTRA" and "Arena IQ".
${langRule}
For YouTube: Provide high-CTR gaming video titles, captivating thumbnail visual concepts, video hooks, short/reel concepts, and structured script outlines.
For Blogs: Provide SEO keywords, compelling meta descriptions, comprehensive article outlines, and engaging drafts.`;
    } else {
      systemInstruction = `You are the NEXUS DESK Assistant, a versatile workspace companion. ${langRule}`;
    }

    let finalPrompt = prompt;
    if (metadata && typeof metadata === 'object') {
      finalPrompt = `Current Workspace Context: ${JSON.stringify(metadata)}\n\nUser Request: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: finalPrompt,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'No response generated.';
    res.json({ success: true, text: replyText });
  } catch (err: unknown) {
    console.error('Gemini API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown AI generation error';
    res.status(500).json({ error: errorMessage });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXUS DESK Server running on http://0.0.0.0:${PORT} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
