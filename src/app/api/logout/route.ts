import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully', success: true });

    response.cookies.set('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
    });

    return response;
}
