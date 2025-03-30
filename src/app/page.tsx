'use client'

import PlayAudio from "@/components/PlayAudio";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ColourfulText } from "@/components/ui/colourful-text.tsx";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { APP_NAME } from "@/lib/constants";
;
import { useEffect, useState } from "react";


const placeholders = [
  "a funky house with 80s hip hop vibes",
  "a chill song with influences from lofi, chillstep, and downtempo",
  "a catchy beat for a podcast intro",
  "a relaxing piano piece for studying",
  "a motivational track for a workout video",
];

interface MessageType {
  type: 'user' | 'ai' | 'audio';
  text: string;
}
const fetchAudioUrl = async (prompt: string): Promise<string> => {
  // Simulating network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const audioUrls: Record<string, string> = {
        "a funky house with 80s hip hop vibes": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "a chill song with influences from lofi, chillstep, and downtempo": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "a catchy beat for a podcast intro": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      };
      resolve(audioUrls[prompt] || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    }, 2000); // Simulating a 2-second delay for the API call
  });
};
export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;
    if (!prompt) return;

    if (prompt.length < 5) {
      alert("Please provide a proper prompt");
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: prompt, type: "user" },
    ]);

    setPrompt("");


    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "Generating audio for: " + prompt, type: "ai" },
    ]);

    const generatedAudioUrl = await fetchAudioUrl(prompt);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "", type: "audio" },
    ]);
    setAudioUrl(generatedAudioUrl); // Set the audio URL
  };

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages: ", messages);
    }
  }, [messages]);



  useEffect(() => {
    if (prompt) console.log("Prompt submitted: ", prompt);
  }, [prompt]);

  return (
    <>
      <BackgroundBeamsWithCollision className="min-h-screen relative w-full flex justify-center items-center" >
        <div className="flex flex-col gap-20 w-full h-full  justify-center items-center overflow-auto ">

          <h1 className="text-5xl p-5  font-bold text-white  w-full absolute top-0 z-2 left-0  font-sans pt-10">
            <ColourfulText text={APP_NAME} />
          </h1>
          <div className="flex flex-col gap-5 w-[50vw] h-full justify-center items-center">
            {
              messages.length===0 ? (
                <div className="font-semibold  text-5xl mb-6 mx-auto  bg-gradient-to-b text-transparent bg-clip-text from-teal-500 to-red-300">
                  Type the kind of sound you need, and let AI bring it to life.
                </div>

              ) : null
            }
        <div className=" flex flex-col gap-5 w-full h-full justify-center items-center overflow-auto">

            {
              messages.map((message, index) => {
                if (message.type === "user") {
                  return (
                    <div key={index} className="text-white text-lg self-end bg-blue-500 p-2 rounded-md">
                      {message.text}
                    </div>
                  );
                } else if (message.type === "ai") {
                  return (
                    <div key={index} className="text-white text-lg self-start p-2 rounded-md">
                      {message.text}
                    </div>
                  );
                } else if (message.type === "audio") {
                  return (
                    <div key={index} className="text-white text-lg self-start rounded-md">
                      Here is your requested sound:
                    <PlayAudio key={index} title={"index"} audioUrl={audioUrl} />
                    </div>
                  );
                }
              })
            }
              </div>
            <div className="w-full flex justify-center items-center">

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
              name="prompt"
              />
              </div>
          </div>
        </div>

      </BackgroundBeamsWithCollision>
    </>
  );
}
