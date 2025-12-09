import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        // --- Receive the payload fields ---
        const { entries, topEmotion, timePeriod, profile } = await req.json();

        if (!entries || entries.length === 0) {
            return NextResponse.json({ error: "No entries provided for analysis." }, { status: 400 });
        }

        // Get latest 5 entries
        const latestEntries = entries.slice(-5);
        const recentDescriptions = latestEntries
            .map((entry: any, index: number) => `Entry ${latestEntries.length - index}: "${entry.description}"`)
            .join('\n');

        const periodDisplay = timePeriod || 'the selected period';

        // --- Optional: calculate urgency if due date is near ---
        let urgencyNote = '';
        if (profile?.due_date) {
            const dueDate = new Date(profile.due_date);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysLeft <= 14) {
                urgencyNote = `⚠️ The user is close to the due date (${daysLeft} days left). Highlight any urgent emotional trends or stress patterns.`;
            }
        }

        // --- Construct the Gemini prompt ---
        const prompt = `
You are a kind, supportive, and non-judgemental pregnancy wellness coach.

**Task:** Provide one single, actionable, and compassionate piece of advice or a positive reflection. Base your advice on the overall dominant emotion, the recent journal entries, and the user's profile.

**User Profile:**
• Name: ${profile?.name || "Unknown"}
• Due Date: ${profile?.due_date || "Unknown"}
• Symptoms: ${profile?.symptoms?.join(", ") || "None reported"}
• Allergies: ${profile?.allergies?.join(", ") || "None reported"}
${urgencyNote}

**Emotional Context (The Trend):** The dominant emotion over ${periodDisplay} is **${topEmotion.toUpperCase()}**.

**Latest Entry Context (The Focus):** The following are the descriptions of the latest ${latestEntries.length} journal entries (most recent is Entry 1):

---
${recentDescriptions}
---

**Instructions for Output:**
1. Keep the response to a single paragraph (max 3 sentences).
2. Start with an encouraging emoji (🌟, 💖, 🌈).
3. Don't use markdown.
4. Focus on synthesizing the themes of the recent entries, dominant emotion, and user profile.
`;

        console.log("Gemini Prompt:", prompt);

        // --- Call the Gemini API ---
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 700,
            }
        });

        const insightText = response?.text?.trim() || "Sorry, I couldn't generate advice this time.";

        return NextResponse.json({ ai_insight: insightText }, { status: 200 });

    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = `Sorry, the AI encountered a problem. Details: ${error instanceof Error ? error.message : String(error)}`;
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
