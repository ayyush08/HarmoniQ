import mongoose, { Schema, Document } from "mongoose";



export interface AudioUrl extends Document {
    // audioData: Buffer;
    url: string;
    title: string;
    createdAt: Date;
}


const AudioUrlSchema = new mongoose.Schema<AudioUrl>({
    url: {
        type: String,
        required: [true, "Audio URL is required"]
    },
    title: {
        type: String,
        required: [true, "Audio title is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String,
        default: null
    },
    savedAudioUrls: [AudioUrlSchema],
}, {
    timestamps: true
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User