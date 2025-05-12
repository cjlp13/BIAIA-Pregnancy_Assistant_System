import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  reply: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('GEMINI_API_KEY environment variable not set.');
        }
        return res.status(500).json({ reply: 'API key not configured.' });
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: `Humanize this response: ${prompt}` }],
            },
          ],
          model: 'gemini-2.0-flash',
          generation_config: {
            temperature: 0.8,
            max_output_tokens: 200,
          },
        }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        return res.status(200).json({ reply });
      } else {
        if (process.env.NODE_ENV !== 'test') {
          console.error('No reply received from Gemini API:', response.data);
        }
        return res.status(500).json({ reply: 'No response from the AI.' });
      }
    } catch (error: any) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Error contacting Gemini API:', error);
      }
      return res.status(500).json({ reply: 'Sorry, something went wrong. Please try again later.' });
    }
  }

  return res.status(405).json({ reply: 'Method Not Allowed' });
}
