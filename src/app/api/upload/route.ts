// pages/api/upload-audio.ts
import { uploadAudioToImageKit } from "@/helpers/imagekit"; // move your function there
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse the JSON body manually
        const { audioBase64 } = body;

        const buffer = Buffer.from(audioBase64, "base64");
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        const audioUrl = await uploadAudioToImageKit(arrayBuffer);

        return NextResponse.json({
            message: "Audio uploaded successfully",
            url: audioUrl,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Failed to upload audio" }, { status: 500 });
    }
}
