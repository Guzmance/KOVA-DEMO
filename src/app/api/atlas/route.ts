import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again later.", text: "Rate limit reached — please wait a few minutes." }, { status: 429 });
  }
  try {
    const { messages, system } = await req.json();
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system,
      messages,
    });
    const text = (res.content[0] as any).text || "";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, text: "Sorry, something went wrong." }, { status: 500 });
  }
}
