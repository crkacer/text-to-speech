import { NextResponse } from "next/server";

export async function POST(request: any) {
    const data = await request.json();
    const response = await fetch(
      `${process.env.HUGGING_FACE_API_URL}`,
      {
          headers: {
              "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
              "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({"inputs": data.inputText}),
      }
  );
    const audio = await response.arrayBuffer();
    if (!response.ok) {
      return new NextResponse(response.statusText, {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  
    return new NextResponse(audio, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
        },
      });
    }
