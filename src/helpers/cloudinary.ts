import cloudinary from "cloudinary";


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadAudioToCloudinary = async (audioBuffer: ArrayBuffer): Promise<string | null> => {
    try {
        // Convert audio buffer to Base64
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");
        const audioDataURI = `data:audio/mpeg;base64,${audioBase64}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(audioDataURI, {
            resource_type: "video", 
            folder: "generated_audio", // Optional: Organize files in a folder
        });

        return uploadResponse.secure_url; // Return the audio URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
};
