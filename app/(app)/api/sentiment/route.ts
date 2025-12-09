import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const HF_API_KEY = process.env.HF_API_KEY
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base"

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: "Journal text is required" }, { status: 400 })

    if (!HF_API_KEY) {
      return NextResponse.json({ error: "HuggingFace API key not set" }, { status: 500 })
    }

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_API_KEY}`,
      },
      body: JSON.stringify({ inputs: text }),
    })

    // Router can return plain text on error, so handle safely
    if (!response.ok) {
      const contentType = response.headers.get("content-type") || ""
      let errorData
      if (contentType.includes("application/json")) {
        errorData = await response.json()
      } else {
        errorData = await response.text()
      }
      console.error("HF API Error:", errorData)
      return NextResponse.json(
        { error: `HuggingFace API failed: ${response.status} ${response.statusText}`, details: errorData },
        { status: 500 }
      )
    }

    const data: any = await response.json()

    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      return NextResponse.json({ error: "Unexpected HF output structure", data }, { status: 500 })
    }

    const emotions = data[0]

    const sentiment_scores: Record<string, number> = {}
    emotions.forEach((e: any) => {
      sentiment_scores[e.label.toLowerCase()] = e.score
    })

    const sentiment_label =
      emotions.reduce((max: any, cur: any) => (cur.score > max.score ? cur : max)).label.toUpperCase()

    return NextResponse.json({ sentiment_label, sentiment_scores })
  } catch (err: any) {
    console.error("Error in sentiment POST:", err)
    return NextResponse.json({ error: err.message || "Something went wrong during processing" }, { status: 500 })
  }
}
