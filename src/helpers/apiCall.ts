import { useState } from "react";
import axios from "axios";
import { NextResponse } from "next/server";
import { convertFlacToMp3 } from "@/lib/convertAudio";


const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY as string;
if (!HF_API_KEY) {
    throw new Error("HF_API_KEY is not defined. Please set it in your environment variables.");
}

const useGenerateSound = () => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSound = async (prompt: string) => {
        setLoading(true);
        setError(null);
        setAudioSrc(null);

        try {

            const geminiResponse = await axios.post("/api/enhance-prompt", {
                text: prompt,
            })

            const enhancedPrompt = geminiResponse.data.enhancedPrompt;

            if (!enhancedPrompt) {
                throw new Error("No enhanced prompt returned from Gemini API.");
            }
            const response = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: enhancedPrompt }),
            });

            if (!response.ok) {
                console.error("Error from Hugging Face API:", response.statusText);
                throw new Error("Failed to generate sound.");
            }

            const flacBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(flacBuffer);
            const mp3Buffer = await convertFlacToMp3(buffer);
            const audioBlob = new Blob([mp3Buffer], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(audioBlob);

            



            console.log(audioUrl);

            setAudioSrc(audioUrl);
        } catch (err: any) {
            setError(err?.message || "Failed to generate sound.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setAudioSrc(null);
        setError(null);
    };

    return { audioSrc, loading, error, generateSound, reset };
};

export default useGenerateSound;