import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export const POST = async (req: NextRequest) => {
  try {
    const { image, prompt } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "Энэ зургийн тайлбарыг гаргаж өг",
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      max_tokens: 500,
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ output: result });
  } catch (error) {
    return NextResponse.json({ error: "Invalid movement!" }, { status: 500 });
  }
};
