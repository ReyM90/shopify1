import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, seoTool } from "@/lib/prompt";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

export async function POST(req: Request) {
  try {
    const { productName, details, keywords, tone } = await req.json();

    if (!details || typeof details !== "string" || details.length > 5000) {
      return NextResponse.json(
        { error: "Please provide product details (max 5000 characters)." },
        { status: 400 }
      );
    }

    const userMessage = [
      `Product name: ${productName || "(not provided)"}`,
      `Target keywords: ${keywords || "(none, choose sensible ones)"}`,
      `Tone: ${tone || "professional and friendly"}`,
      `Raw product details:\n${details}`,
    ].join("\n\n");

    const message = await client.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      tools: [seoTool],
      tool_choice: { type: "tool", name: "submit_seo_listing" },
      messages: [{ role: "user", content: userMessage }],
    });

    const toolUse = message.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "No result returned." }, { status: 502 });
    }

    return NextResponse.json(toolUse.input);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}