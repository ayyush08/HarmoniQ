import { useState } from "react";
import axios from "axios";
import { audio } from "motion/react-client";

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
            const res = await axios.post("/api/generate-sound", {
                enhancedPrompt: enhancedPrompt,
            }, {
                responseType: "blob",
            });

            const audioBlob = new Blob([res.data], { type: "audio/mp3" });
            const audioUrl = URL.createObjectURL(audioBlob);

            console.log(res.data);
            
            // const audio = res?.data?.audioUrl

            console.log(audioUrl);
            
            setAudioSrc(audioUrl);
        } catch (err: any) {
            setError(err?.message || "Failed to generate sound.");
        } finally {
            setLoading(false);
        }
    };

    return { audioSrc, loading, error, generateSound };
};

export default useGenerateSound;
