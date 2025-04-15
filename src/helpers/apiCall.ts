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
    const [mp3Buffer, setMp3Buffer] = useState<Buffer | null>(null); // Buffer to hold the MP3 data
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
            const response = await axios.post(
                "http://localhost:5000/generate",
                { prompt: enhancedPrompt },
                { responseType: "arraybuffer" } // 👈 Important!
            );


            console.log("Response from Hugging Face API:", response);


            if (!response.data) {
                console.error("Error from Hugging Face API:", response.statusText);
                throw new Error("Failed to generate sound.");
            }

            const flacData = response.data; // This is already an ArrayBuffer
            const mp3Data = await convertFlacToMp3(flacData); // Convert FLAC to MP3
            setMp3Buffer(mp3Data); // Store the MP3 data in state
            const audioBlob = new Blob([mp3Data], { type: "audio/mp3" }); 
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioSrc(audioUrl); // Use it in <audio> tag or Plyr





            console.log(response.data)
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

    return { audioSrc, loading, error, generateSound, reset, mp3Buffer };
};

export default useGenerateSound;