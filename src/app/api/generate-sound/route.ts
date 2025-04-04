import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HF_API_KEY as string;
if (!HF_API_KEY) {
    throw new Error("HF_API_KEY is not defined. Please set it in your environment variables.");
}

export async function POST(request: Request) {
    try {
        const { enhancedPrompt } = await request.json();

        const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: enhancedPrompt })
        });

        if (!response.ok) {
            console.error("Error from Hugging Face API:", response.statusText);
            return new NextResponse("Failed to generate sound.", { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg", // or "audio/wav" depending on model
                "Content-Disposition": "inline; filename=generated.mp3"
            }
        });

    } catch (error) {
        console.error("Error generating sound:", error);
        return NextResponse.json({ error: "Failed to generate sound." }, { status: 500 });
    }
}
