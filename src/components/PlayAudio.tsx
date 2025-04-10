'use client'
import React, { useEffect } from 'react';
// import Plyr from 'plyr-react';
import dynamic from 'next/dynamic';

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import 'plyr/dist/plyr.css';

interface PlayAudioProps {
    audioUrl: string;
    title: string;
}

const PlayAudio: React.FC<PlayAudioProps> = ({ audioUrl, title }) => {
    const options = {
        autoplay: true,
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
        muted: false,
    };

    useEffect(() => { }, [audioUrl]);

    return (
        <div className="audio-player-container  mx-auto self-start  rounded-lg shadow-lg p-5">
            <h2 className="text-5xl p-4 capitalize leading-loose font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500">
                {title}
            </h2>
            <Plyr
                source={{
                    type: "audio",
                    sources: [
                        {
                            src: audioUrl,
                            type: "audio/mp3"
                        }
                    ]
                }}
                options={options}
            />

        </div>
    );
};

export default PlayAudio;

