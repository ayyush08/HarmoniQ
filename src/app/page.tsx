'use client'

import PlayAudio from "@/components/PlayAudio";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ColourfulText } from "@/components/ui/colourful-text.tsx";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";

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
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (prompt.trim().length < 5) {
      alert("Please provide a proper prompt");
      return;
    }

    setIsLoading(true);

    const generatedAudioUrl = await fetchAudioUrl(prompt);
    setAudioUrl(generatedAudioUrl);
    setPrompt("");
    setIsLoading(false);
  };


  if (isLoading) {
    return (
      <BackgroundBeamsWithCollision className="min-h-screen w-full flex flex-col justify-center items-center">
        <div className="flex flex-col gap-5 w-full justify-center items-center">
          <h1 className="text-5xl p-5 font-bold text-white absolute top-0 left-0 font-sans pt-10">
            <ColourfulText text={APP_NAME} />
          </h1>
        </div>

        {/* Centered "Generating your sound..." */}
        <div className="flex flex-1 w-full justify-center items-center">
          <div className="text-white text-lg text-center">Generating your sound...</div>
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
              <div className="font-semibold text-5xl mb-6 mx-auto bg-gradient-to-b text-transparent bg-clip-text from-teal-500 to-red-300">
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
                <div className="text-white text-lg">
                  Here is your requested sound:
                  <PlayAudio title="Generated Sound" audioUrl={audioUrl} />
                </div>

                <button onClick={() => setAudioUrl("")} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </section>
  );
}
