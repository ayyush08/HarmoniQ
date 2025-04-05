'use client'

import PlayAudio from "@/components/PlayAudio";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ColourfulText } from "@/components/ui/colourful-text.tsx";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
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

const fetchAudioUrl = async (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const audioUrls: Record<string, string> = {
        "a funky house with 80s hip hop vibes": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "a chill song with influences from lofi, chillstep, and downtempo": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "a catchy beat for a podcast intro": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      };
      resolve(audioUrls[prompt] || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    }, 2000);
  });
};

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const {
    audioSrc,
    loading,
    error,
    generateSound
  } = useGenerateSound();

  useEffect(() => {
    if (audioSrc) {
      setAudioUrl(audioSrc);
    }

  }, [prompt, audioSrc]);

  if (error) {
    alert(error);
  }


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


  if (loading) {
    return (
      <BackgroundBeamsWithCollision className="min-h-screen w-full flex flex-col justify-center items-center">
        <div className="flex flex-col gap-5 w-full justify-center items-center">
          <h1 className="text-5xl p-5 font-bold text-white absolute top-0 left-0 font-sans pt-10">
            <ColourfulText text={APP_NAME} />
          </h1>
        </div>

        {/* Centered "Generating your sound..." */}
        <div className="flex flex-1 w-full justify-center items-center text-5xl leading-loose ">
          <ColourfulText text="Generating your sound..." />
        </div>
      </BackgroundBeamsWithCollision>

    )
  }

  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <BackgroundBeamsWithCollision className="min-h-screen w-full flex justify-center items-center">
        <div className="flex flex-col gap-20 w-full justify-center items-center">
          <h1 className="text-5xl p-5 font-bold text-white absolute top-0 left-0 font-sans pt-10">
            <ColourfulText text={APP_NAME} />
          </h1>

          <div className="flex flex-col gap-5 w-[50vw] min-h-screen justify-center items-center">
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
                onClick={()=>{
                  setAudioUrl(null);
                  setPrompt("");
                }}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Regenerate another sound
                  </span>
                </button>
              </>
            )}
            {audioSrc && (
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  <a href={audioSrc} download="generated.mp3" className="">
                    Download MP3
                  </a>

                </span>
              </button>
            )}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
}
