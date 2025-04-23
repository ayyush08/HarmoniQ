import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import { connectDB } from '@/dbConfig/db';

connectDB();


export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized, Token not found' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        const userId = decoded._id;

        const userExist = User.findById(userId);
        if (!userExist) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = await User.findById(userId).select('-password');

        const audios = await User.aggregate([
            {
                $match: {
                    _id: user._id
                }
            },
            {
                $unwind: "$savedAudioUrls"
            },
            {
                $sort: {
                    "savedAudioUrls.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    audios: {
                        $push: "$savedAudioUrls"
                    }
                }
            }
        ])

        
        return NextResponse.json({
            message: 'User details fetched successfully',
            user:{
                username: user.username,
                savedAudioUrls: audios[0]?.audios || [],
            }

        }, {
            status: 200,
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Unable to fetch user details" }, { status: 500 });

    }
}