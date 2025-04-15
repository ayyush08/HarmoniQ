import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
});


export const uploadAudioToImageKit = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {

        const base64Audio = Buffer.from(arrayBuffer).toString("base64");
        const uploadResponse = await imagekit.upload({
            file: `data:audio/mp3;base64,${base64Audio}`,
            fileName: `harmoniq_${Date.now()}.mp3`,
            folder: "/harmoniq-audios/",
            useUniqueFileName: true,
        });

        console.log("ImageKit Upload Response:", uploadResponse);
        

        return uploadResponse.url;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw new Error("Failed to upload audio to ImageKit.");
    }
};