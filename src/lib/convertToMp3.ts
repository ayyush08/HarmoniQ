import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { randomUUID } from 'crypto';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function convertFlacToMp3(flacBuffer: Buffer): Promise<Buffer> {
    const id = randomUUID();
    const inputPath = path.join(tmpdir(), `${id}.flac`);
    const outputPath = path.join(tmpdir(), `${id}.mp3`);

    try {
        await fs.writeFile(inputPath, flacBuffer);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .audioBitrate('96k')
                .toFormat('mp3')
                .save(outputPath)
                .on('end', () => resolve())
                .on('error', reject);
        });

        const mp3Buffer = await fs.readFile(outputPath);
        return mp3Buffer;
    } catch (error) {
        console.error("Conversion failed:", error);
        throw new Error("Failed to convert FLAC to MP3.");
    } finally {
        await Promise.allSettled([
            fs.unlink(inputPath),
            fs.unlink(outputPath),
        ]);
    }
}
