import { connectDB } from "@/dbConfig/db";
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Create JWT token
        const tokenData = {
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        };

        const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1d',
        });

        // Set token in cookie
        const response = NextResponse.json({
            message: "Account created successfully",
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
