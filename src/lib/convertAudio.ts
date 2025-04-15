// utils/convertFlacToMp3.ts
import { Mp3Encoder } from '@breezystack/lamejs';
import decodeAudio from 'audio-decode';

export async function convertFlacToMp3(flacBuffer: Buffer): Promise<Buffer> {
  try {
    // Convert Buffer to ArrayBuffer
    const arrayBuffer = new Uint8Array(flacBuffer).buffer;

    // Decode FLAC to AudioBuffer
    const audioBuffer = await decodeAudio(arrayBuffer as ArrayBuffer);

    // Initialize MP3 encoder
    const encoder = new Mp3Encoder(
      audioBuffer.numberOfChannels,
      audioBuffer.sampleRate,
      128
    );

    const mp3Chunks: Uint8Array[] = [];
    const blockSize = 1152;

    // Process audio channels
    for (let i = 0; i < audioBuffer.length; i += blockSize) {
      const left = float32ToInt16(audioBuffer.getChannelData(0).subarray(i, i + blockSize));
      
      if (audioBuffer.numberOfChannels === 2) {
        const right = float32ToInt16(audioBuffer.getChannelData(1).subarray(i, i + blockSize));
        const chunk = encoder.encodeBuffer(left, right);
        if (chunk.length > 0) mp3Chunks.push(new Uint8Array(chunk));
      } else {
        const chunk = encoder.encodeBuffer(left);
        if (chunk.length > 0) mp3Chunks.push(new Uint8Array(chunk));
      }
    }

    // Finalize encoding
    const finalChunk = encoder.flush();
    if (finalChunk.length > 0) mp3Chunks.push(new Uint8Array(finalChunk));

    // Combine chunks
    return Buffer.concat(mp3Chunks);
  } catch (error) {
    throw new Error(`FLAC-to-MP3 conversion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper: Convert Float32 to Int16
function float32ToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    output[i] = Math.max(-32768, Math.min(32767, input[i] * (input[i] < 0 ? 32768 : 32767)));
  }
  return output;
}
