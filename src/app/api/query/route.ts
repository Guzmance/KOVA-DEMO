import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Try again later.", answer: "Rate limit reached — please wait a few minutes." }, { status: 429 });
  }
  try {
    const { question, vertical, contacts, deals } = await req.json();
    const contactSummary = contacts.map((c: any) => ({
      name: `${c.fn} ${c.ln}`, company: c.co, score: c.score,
      status: c.status, city: c.city, role: c.role
    }));
    const dealSummary = deals.map((d: any) => ({
      title: d.title, value: d.val,
      stage: d.stage_hist?.[d.stage_hist.length-1], probability: d.prob
    }));
    const prompt = `You are a business intelligence assistant for a ${vertical} CRM platform.

Current contacts in system:
${JSON.stringify(contactSummary, null, 2)}

Current pipeline deals:
${JSON.stringify(dealSummary, null, 2)}

Question: "${question}"

Answer concisely and specifically using the actual data above. 
Format your answer as 2-3 sentences of insight followed by a specific action item.
Reference real names and numbers from the data.`;

    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });
    return NextResponse.json({ answer: (res.content[0] as any).text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
