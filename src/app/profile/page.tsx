"use client";
import React, { useEffect, useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { APP_NAME } from "@/lib/constants";
import PlayAudio from "@/components/PlayAudio"; // your audio player
import { useRouter } from "next/navigation";

type Sound = {
    audioData: Buffer;
    title: string;
    createdAt: string;
    url?: string ; // URL for the audio blob
};

const ProfilePage = () => {
    const [sounds, setSounds] = useState<Sound[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [username, setUsername] = useState<string>("");
    
    useEffect(() => {
        const fetchSavedSounds = async () => {
            try {
                const res = await fetch("/api/me", { method: "GET" }); // make sure this route returns user sounds
                if (!res.ok) throw new Error("Failed to fetch sounds");

                const data = await res.json();
                const savedSounds = data.user.savedAudioUrls || [];
                setUsername(data.user.username || ""); // Assuming the API returns the username

                setSounds(savedSounds);
            } catch (error) {
                console.error("Error fetching sounds:", error);
                alert("Session expired or error fetching sounds.");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedSounds();
    }, []);

    const handlePlay = (soundId: number) => {
        setPlayingId((prev) => (prev === soundId ? null : soundId));
    };

    return (
        <WavyBackground
            colors={["teal", "blue"]}
            className="min-h-screen w-full flex flex-col items-center py-16 px-4"
        >
            <h2 className="text-4xl italic font-bold text-neutral-100 mb-6 mt-5">
                {username}
            </h2>

            {loading ? (
                <p className="text-white">Loading your sounds...</p>
            ) : sounds.length === 0 ? (
                <p className="text-white">No saved sounds found.</p>
            ) : (
                <div className="w-full max-w-2xl space-y-6">
                    {sounds.map((sound, idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-md text-white"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-semibold">{sound.title}</h4>
                                    <p className="text-sm text-gray-300">{new Date(sound.createdAt).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => handlePlay(idx)}
                                    className="bg-amber-500 text-lg cursor-pointer hover:bg-amber-600 px-4 py-2 rounded text-white font-medium"
                                >
                                    {playingId === idx ? "Stop" : "Play"}
                                </button>
                            </div>
                            {playingId === idx && (
                                <div className="mt-4">
                                    <PlayAudio audioUrl={sound.url || ""} title={sound.title} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </WavyBackground>
    );
};

export default ProfilePage;
