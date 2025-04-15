import { connectDB } from "@/dbConfig/db";
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isCorrectPassword = await bcryptjs.compare(password, user.password);
        if (!isCorrectPassword) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1d',
        });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
