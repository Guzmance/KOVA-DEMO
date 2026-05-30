import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { record, vertical, tone, weights } = await req.json();
    const prompt = `You are a ${tone || "professional"} business analyst scoring a ${vertical || "real_estate"} lead.
Scoring weights: ${JSON.stringify(weights || {})}
Lead record: ${JSON.stringify(record)}
Return ONLY a JSON object (no markdown, no explanation):
{"composite_score":<number 0-100>,"score_breakdown":{"Distress Index":<0-100>,"Equity Score":<0-100>,"Sellability":<0-100>,"Days Vacant":<0-100>,"Tax Delinquency":<0-100>},"ai_insight":"<2-3 sentence explanation>","recommended_action":"<specific next action>"}`;
    const res = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = (res.content[0] as any).text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
