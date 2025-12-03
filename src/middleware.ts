import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_EMAIL = 'mdmokammelmorshed@gmail.com';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin dashboard routes
    if (pathname.startsWith('/dashboard/admin') || pathname === '/udyomx-admin') {
        // Check for admin session
        const adminSession = request.cookies.get('admin-session');
        
        if (!adminSession) {
            // Redirect to admin login (Google OAuth)
            return NextResponse.redirect(new URL('/auth/google?admin=true', request.url));
        }
        
        // Verify admin email
        try {
            const session = JSON.parse(adminSession.value);
            if (session.email !== ADMIN_EMAIL) {
                // Not admin - show not found
                return NextResponse.redirect(new URL('/not-found', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/auth/google?admin=true', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/admin/:path*', '/udyomx-admin'],
};
