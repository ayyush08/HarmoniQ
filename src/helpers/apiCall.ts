import { useState } from "react";
import axios from "axios";
import { convertFlacToMp3 } from "@/lib/convertAudio";




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
                setError(geminiResponse.data.error || "Please provide a valid prompt.");
            }
            console.log("Enhanced Prompt:", geminiResponse);
            
            const response = await axios.post(
                "http://localhost:5000/generate",
                { prompt: enhancedPrompt },
                { responseType: "arraybuffer" } 
            );


            console.log("Response from Hugging Face API:", response);


            if (!response.data) {
                console.error("Error from Hugging Face API:", response.statusText);
                throw new Error("Failed to generate sound.");
            }

            const flacData = response.data; 
            const mp3Data = await convertFlacToMp3(flacData); 
            setMp3Buffer(mp3Data); 
            const audioBlob = new Blob([mp3Data], { type: "audio/mp3" }); 
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioSrc(audioUrl); 





            console.log(response.data)
        } catch (err: any) {
            console.log(err);
            setError(err?.response?.data?.error || "Failed to generate sound.");
            
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