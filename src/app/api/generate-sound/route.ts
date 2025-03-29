
import { uploadAudioToImageKit } from "@/helpers/imagekit";
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

        if(!response.ok) {
            console.error("Error from Hugging Face API:", response.statusText);
            return NextResponse.json({ error: "Failed to generate sound." }, { status: 500 });
        }

        const base64Audio = await response.arrayBuffer();
        console.log("Base64 Audio:", base64Audio);
        

        const audioImageKitURL = await uploadAudioToImageKit(base64Audio);
        if (!audioImageKitURL) {
            console.error("Error uploading audio to ImageKit.");
            return NextResponse.json({ error: "Failed to upload audio." }, { status: 500 });
        }

        return NextResponse.json({
            audioURL: audioImageKitURL,
        }, {
            status: 200,
            statusText: "OK",
        });

    } catch (error) {
        console.error("Error generating sound:", error);
        return NextResponse.json({ error: "Failed to generate sound." }, { status: 500 });
    }
}