import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  reply: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.5-flash';

    if (!apiKey) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('GEMINI_API_KEY environment variable not set.');
      }
      return res.status(500).json({ reply: 'API key not configured.' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: `Humanize this response: ${prompt}` }],
          },
        ],
        generationConfig: { 
          temperature: 0.8,
          maxOutputTokens: 1024, 
        },
      }
    );
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (reply) {
      return res.status(200).json({ reply });
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.error('No usable text reply received from Gemini API:', {
            data: response.data,
            reason: response.data?.candidates?.[0]?.finishReason
        });
      }
      return res.status(500).json({ reply: 'No response from the AI. Check server logs for details.' });
    }
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error contacting Gemini API:', {
        message: error.message,
        response: error.response?.data, 
      });
    }
    return res.status(500).json({ reply: 'Sorry, something went wrong. Please try again later.' });
  }
}