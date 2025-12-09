import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lat, lng, categories } = await req.json();

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    const key = process.env.FOURSQUARE_KEY!;

    const url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categories}&radius=5000&limit=10`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}` },
      cache: "force-cache", // avoids spamming their servers
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Foursquare hit you with a rate-limit or bad key." },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
