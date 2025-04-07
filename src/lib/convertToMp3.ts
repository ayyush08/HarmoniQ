import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { randomUUID } from 'crypto';


ffmpeg.setFfmpegPath(ffmpegPath || ''); 
export async function convertFlacToMp3(flacBuffer: Buffer): Promise<Buffer> {
    const id = randomUUID();
    const inputPath = path.join(tmpdir(), `${id}.flac`);
    const outputPath = path.join(tmpdir(), `${id}.mp3`);

    try {
        // Write FLAC file
        await fs.writeFile(inputPath, flacBuffer);

        // Convert to MP3
        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .audioBitrate('96k') // Reduce bitrate to speed up conversion
                .toFormat('mp3')
                .save(outputPath)
                .on('end', () => resolve())
                .on('error', (err) => reject(err));
        });

        // Read converted MP3 buffer
        const mp3Buffer = await fs.readFile(outputPath);
        return mp3Buffer;
    } catch (error) {
        console.error("Conversion failed:", error);
        throw new Error("Failed to convert FLAC to MP3.");
    } finally {
        // Cleanup
        await Promise.allSettled([
            fs.unlink(inputPath),
            fs.unlink(outputPath),
        ]);
    }
}
