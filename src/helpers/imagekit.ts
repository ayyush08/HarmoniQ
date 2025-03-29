import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


export const uploadAudioToImageKit = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {

        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        const uploadResponse = await imagekit.upload({
            file: `data:audio/wav;base64,${base64Audio}`,
            fileName: `harmoniq_${Date.now()}.wav`,
            folder: "/harmoniq-audios/",
            useUniqueFileName: true,
        });

        return uploadResponse.url; 
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw new Error("Failed to upload audio to ImageKit.");
    }
};
