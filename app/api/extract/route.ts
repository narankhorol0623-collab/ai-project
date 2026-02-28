import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { prompt } = await req.json();

  const response = await fetch("http://api.openai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `Extract the dish name and ingredients from:"${prompt}"`,
    }),
  });

  if (!response.ok) {
    const errortext = await response.text();

    console.error("API Error:", response.status, errortext);
    return NextResponse.json({ error: errortext }, { status: response.status });
  }

  const data = await response.json();
  const text = data.output[0].content[0].text;

  const formattedText = text.replace(/\\n/g, "");

  return NextResponse.json({ formattedText });
};
