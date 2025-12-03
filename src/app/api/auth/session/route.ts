import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin-session');
    
    if (adminSession) {
        try {
            const session = JSON.parse(adminSession.value);
            return NextResponse.json({ session });
        } catch {
            return NextResponse.json({ session: null });
        }
    }
    
    return NextResponse.json({ session: null });
}
