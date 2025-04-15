import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import { connectDB } from '@/dbConfig/db';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Please Login or create an account to save' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        const userId = decoded._id;

        const reqBody = await request.json();
        const { url, title } = reqBody;

        if (!url || !title) {
            return NextResponse.json({ error: 'Missing url or title' }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // const buffer = Buffer.from(audioData, 'base64');
        user.savedAudioUrls.push({ url, title });
        await user.save();

        return NextResponse.json({
            message: 'Audio URL saved successfully',
            savedAudioUrls: user.savedAudioUrls,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
    }
}
