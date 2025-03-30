import React, { useEffect } from 'react';
import Plyr from 'plyr-react';
import 'plyr/dist/plyr.css';

interface PlayAudioProps {
    audioUrl: string ;
    title: string;
    posterUrl?: string;
}

const PlayAudio: React.FC<PlayAudioProps> = ({ audioUrl, title, posterUrl }) => {
    const options = {
        autoplay: true,
        controls: ['play', 'progress', 'current-time', 'mute', 'volume',],
        muted: false,
    };

    useEffect(() => {}, [audioUrl]);

    return (
        <div className="audio-player-container  mx-auto self-start  rounded-lg shadow-lg">
            
            <Plyr
                source={{
                    type: 'audio',
                    sources: [
                        {
                            src: audioUrl,
                            type: 'audio/mp3',
                            
                        },
                    ],
                    poster: posterUrl,
                }}
                options={options}
                
            />
        </div>
    );
};

export default PlayAudio;
