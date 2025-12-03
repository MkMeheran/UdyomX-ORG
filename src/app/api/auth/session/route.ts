import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const adminSession = request.cookies.get('admin-session');
    
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
