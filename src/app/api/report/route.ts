import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { tenantName, vertical, leads, deals, tone } = await req.json();
    const prompt = `Write a ${tone || "professional"} weekly intelligence report for ${tenantName} (${vertical} vertical).
New leads this week: ${leads?.length || 0} | Active deals: ${deals?.length || 0}
Total pipeline value: $${deals?.reduce((a: number, d: any) => a + (d.val || 0), 0).toLocaleString() || 0}

Write a concise Monday morning briefing with these sections:
1. Executive Summary (2-3 sentences)
2. Top 3 Leads to Contact Today (with specific reasons)
3. Pipeline Update (deals advancing or at risk)
4. 3 Action Items for This Week

Keep it under 300 words. Be specific, not generic.`;
    const res = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });
    const report = (res.content[0] as any).text || "";
    return NextResponse.json({ report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
