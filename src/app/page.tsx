'use client'

import Navbar from "@/components/Navbar";
import PlayAudio from "@/components/PlayAudio";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ColourfulText } from "@/components/ui/colourful-text.tsx";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { WavyBackground } from "@/components/ui/wavy-background";
import useGenerateSound from "@/helpers/apiCall";
import { APP_NAME } from "@/lib/constants";
import { useEffect, useState } from "react";


const placeholders = [
  "a funky house with 80s hip hop vibes",
  "a chill song with influences from lofi, chillstep, and downtempo",
  "a catchy beat for a podcast intro",
  "a relaxing piano piece for studying",
  "a motivational track for a workout video",
];



export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSavingAudio, setIsSavingAudio] = useState<boolean>(false);
  const {
    audioSrc,
    loading,
    error,
    generateSound,
    reset: resetSound,
    mp3Buffer,
  } = useGenerateSound();

  useEffect(() => {
    if (audioSrc) {
      setAudioUrl(audioSrc);
    }

  }, [prompt, audioSrc, setAudioUrl, setPrompt,error]);


  const handleReset = () => {
    setAudioUrl(null);
    setPrompt("");
    resetSound(); // <-- this is crucial
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // setPrompt(e.target.value)
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;
    if (prompt.trim().length < 5) {
      alert("Please provide a proper prompt");
      return;
    }

    setPrompt(prompt)

    await generateSound(prompt);

  };

  const handleSave = async () => {
    try {
      setIsSavingAudio(true);
      if (!audioSrc) {
        alert("No audio to save");
        return;
      }
      const res = await fetch('/api/me'); // your auth-check API
      if (!res.ok) {
          alert("Please login to save your audio");
          return;
      } 
      
      const audioBase64 = mp3Buffer
        ? arrayBufferToBase64(
          mp3Buffer.buffer.slice(
            mp3Buffer.byteOffset,
            mp3Buffer.byteOffset + mp3Buffer.byteLength
          ) as ArrayBuffer
        )
        : "";


      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioBase64: audioBase64,
        }),
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload audio to ImageKit");
      }

      const { url } = await uploadRes.json();

      // Step 2: Save URL + prompt to DB
      const saveRes = await fetch("/api/save-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, title: prompt }),
      });

      if (!saveRes.ok) throw new Error("Failed to save audio URL");

      alert("Audio saved successfully!");
    } catch (error) {
      console.error("Error saving audio:", error);
      alert("An error occurred while saving the audio. Please try again.");

    }finally{
      setIsSavingAudio(false);
    }
  }


  if (loading) {
    return (
      <WavyBackground colors={
        [
          'teal',
          'blue',
        ]
      } className="min-h-screen w-full flex flex-col justify-center items-center">


        {/* Centered "Generating your sound..." */}
        <div className="flex  w-full justify-center mb-10 font-extrabold items-center text-6xl   leading-loose ">
          <ColourfulText text="Generating your sound..." />
        </div>
      </WavyBackground>

    )
  }

  return (

    <WavyBackground
      colors={[
        'teal',
        'blue',
      ]}

      className="min-h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-40 w-full justify-center items-center">


        <div className="flex flex-col gap-5 w-[50vw] min-h-screen justify-center items-center">
          {
            error && (
              <div className="text-red-500 text-center text-2xl  font-semibold mb-4">
                {error}
              </div>
            )}
          {!audioUrl && (
            <div className="font-bold italic p-5 text-5xl mb-6 mx-auto bg-gradient-to-b text-transparent bg-clip-text from-teal-500 to-red-300">
              Type the kind of sound you need, and let AI bring it to life.
            </div>
          )}

          {!audioUrl && (
            <div className="w-full flex justify-center items-center">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
                name="prompt"
              />
            </div>
          )}

          {audioUrl && (
            <>
              <div className="text-white text-center text-lg font-semibold mb-4">
                Here is your requested sound:
                <PlayAudio title={prompt} audioUrl={audioUrl} />
              </div>

              <button
                onClick={handleReset}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Regenerate another sound
                </span>
              </button>
            </>
          )}
          {audioSrc && (
            <>
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  <a href={audioSrc} download={prompt} className="">
                    Download MP3
                  </a>

                </span>
              </button>
              <button disabled={isSavingAudio} onClick={() => handleSave()} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  {
                    isSavingAudio ? "Saving..." : "Save to your profile"
                  }

                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </WavyBackground>

  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}
