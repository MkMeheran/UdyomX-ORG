import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    
    // Delete admin session cookie by setting it to expire immediately
    response.cookies.set('admin-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire immediately
        path: '/',
    });
    
    return response;
}
