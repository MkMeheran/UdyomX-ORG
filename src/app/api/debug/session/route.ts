import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const adminSession = request.cookies.get('admin-session');
    
    if (!adminSession) {
        return NextResponse.json({ 
            hasSession: false, 
            message: 'No admin-session cookie found' 
        });
    }
    
    try {
        const session = JSON.parse(adminSession.value);
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mdmokammelmorshed@gmail.com';
        
        return NextResponse.json({ 
            hasSession: true,
            sessionEmail: session.email,
            expectedAdminEmail: ADMIN_EMAIL,
            isMatch: session.email === ADMIN_EMAIL,
            session: {
                ...session,
                // Hide sensitive data
                id: '***'
            }
        });
    } catch (error) {
        return NextResponse.json({ 
            hasSession: true, 
            error: 'Failed to parse session',
            raw: adminSession.value.substring(0, 50) + '...'
        });
    }
}
