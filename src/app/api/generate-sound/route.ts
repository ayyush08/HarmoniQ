import { convertFlacToMp3 } from "@/lib/convertToMp3";
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

        const flacBuffer = Buffer.from(await response.arrayBuffer());

        // 🔥 Convert it properly
        const mp3Buffer = await convertFlacToMp3(flacBuffer);

        if (!mp3Buffer || mp3Buffer.length === 0) {
            throw new Error("Conversion returned empty buffer");
        }

        return new NextResponse(mp3Buffer, {
            status: 200,
            headers: {
                "Content-Type": "audio/mp3",
                "Content-Disposition": "inline; filename=generated.mp3",
                "Content-Length": mp3Buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Error generating sound:", error);
        return NextResponse.json({ error: "Failed to generate sound." }, { status: 500 });
    }
}
