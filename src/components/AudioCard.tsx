import React, { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, Download, Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface AudioCardProps {
    title: string;
    audioUrl: string;
    className?: string;
    variant?: "default" | "dark" | "minimal";
}

const AudioCard = ({
    title,
    audioUrl,
    className,
    variant = "default"
}: AudioCardProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.volume = volume;

        // Set up event listeners
        audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
        audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
        audio.addEventListener("ended", () => setIsPlaying(false));

        // Clean up
        return () => {
            audio.pause();
            audio.src = "";
            audio.removeEventListener("loadedmetadata", () => setDuration(audio.duration));
            audio.removeEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
            audio.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, [audioUrl]);

    // Toggle play/pause
    const togglePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
                toast("Error playing audio. Please check your browser settings.");
            });
            setIsPlaying(true);
        }
    }, [isPlaying]);

    // Handle seeking
    const handleSeek = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !audioRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newTime = percentage * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }, [duration]);

    // Handle volume change
    const handleVolumeChange = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!volumeRef.current || !audioRef.current) return;

        const rect = volumeRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const newVolume = Math.max(0, Math.min(1, x / rect.width));

        audioRef.current.volume = newVolume;
        setVolume(newVolume);
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (!audioRef.current) return;

        if (volume > 0) {
            audioRef.current.volume = 0;
            setVolume(0);
        } else {
            audioRef.current.volume = 0.7;
            setVolume(0.7);
        }
    }, [volume]);

    // Download audio
    const downloadAudio = useCallback(() => {
        try {
            const a = document.createElement("a");
            a.href = audioUrl;
            a.download = `${title.replace(/\s+/g, "_")}.flac`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);

            toast("Download started , Your audio file is being downloaded");
        } catch (err) {
            console.error("Error downloading audio:", err);
            toast("Download failed. Please try again.");
        }
    }, [audioUrl, title]);

    // Format time (mm:ss)
    const formatTime = (timeInSeconds: number): string => {
        if (isNaN(timeInSeconds)) return "0:00";

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Get volume icon based on level
    const VolumeIcon = useCallback(() => {
        if (volume === 0) return <VolumeX size={18} />;
        if (volume < 0.33) return <Volume size={18} />;
        if (volume < 0.66) return <Volume1 size={18} />;
        return <Volume2 size={18} />;
    }, [volume]);

    // Get variant-specific classes
    const getVariantClasses = useCallback(() => {
        switch (variant) {
            case "minimal":
                return "bg-white border border-gray-200 shadow-sm";
            case "dark":
                return "bg-audio-dark text-white";
            default:
                return "bg-gradient-to-r from-audio-primary to-audio-secondary text-white";
        }
    }, [variant]);

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <Card className={cn("w-full overflow-hidden", getVariantClasses(), className)}>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg text-center font-bold capitalize truncate">{title}</CardTitle>
            </CardHeader>

            <CardContent className="p-4">
                {/* Progress bar */}
                <div
                    ref={progressRef}
                    className="relative h-2 mb-2 rounded-full bg-gray-500/40 cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        className="absolute h-full rounded-full bg-audio-primary"
                        style={{ width: `${progressPercentage}%` }}
                    />
                    <div
                        className="absolute h-4 w-4 rounded-full bg-white border-2 border-audio-primary shadow-md transform -translate-y-1/4"
                        style={{
                            left: `calc(${progressPercentage}% - 0.5rem)`,
                            top: "50%",
                        }}
                    />
                </div>

                {/* Time display */}
                <div className="flex justify-between text-xs mb-3">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                {/* Play/Pause button */}
                <button
                    onClick={togglePlayPause}
                    className={cn(
                        "flex items-center justify-center rounded-full p-2 transition-colors",
                        variant === "dark"
                            ? "bg-audio-light text-audio-dark hover:bg-white"
                            : "bg-white text-audio-primary hover:bg-gray-100",
                        "shadow"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Volume control */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMute}
                        className="text-white hover:text-audio-light transition-colors"
                    >
                        <VolumeIcon />
                    </button>
                    <div
                        ref={volumeRef}
                        className="relative h-1.5 w-20 bg-gray-300 rounded-full cursor-pointer"
                        onClick={handleVolumeChange}
                    >
                        <div
                            className="absolute h-full bg-audio-primary rounded-full"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <div
                            className="absolute h-3 w-3 rounded-full bg-white border border-audio-primary transform -translate-y-1/4"
                            style={{
                                left: `calc(${volume * 100}% - 0.375rem)`,
                                top: "50%",
                            }}
                        />
                    </div>
                </div>

                {/* Download button */}
                <button
                    onClick={downloadAudio}
                    className="hover:text-audio-light transition-colors"
                    aria-label="Download"
                >
                    <Download size={20} />
                </button>
            </CardFooter>
            <Toaster/>
        </Card>
    );
};

export default AudioCard;