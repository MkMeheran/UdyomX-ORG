import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = cookies();
    
    // Delete admin session cookie
    cookieStore.delete('admin-session');
    
    return NextResponse.json({ success: true });
}
