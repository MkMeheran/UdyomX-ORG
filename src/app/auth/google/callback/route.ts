import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mdmokammelmorshed@gmail.com';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state'); // admin=true or undefined

    // Get the base URL for redirects
    const baseUrl = request.nextUrl.origin;

    if (error) {
        return NextResponse.redirect(`${baseUrl}/?error=${error}`);
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/?error=no_code`);
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: `${baseUrl}/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
            console.error('Token error:', tokens);
            return NextResponse.redirect(`${baseUrl}/?error=token_error`);
        }

        // Get user info
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        const userInfo = await userInfoResponse.json();

        if (userInfo.error) {
            console.error('User info error:', userInfo);
            return NextResponse.redirect(`${baseUrl}/?error=user_info_error`);
        }

        // Check if user is admin
        const isAdmin = userInfo.email === ADMIN_EMAIL;
        
        // If trying to access admin but not admin email - show not found
        if (state === 'admin' && !isAdmin) {
            return NextResponse.redirect(`${baseUrl}/not-found`);
        }

        // Create session object
        const session = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            isAdmin,
            loginAt: new Date().toISOString(),
        };

        // Set admin session cookie and redirect to admin dashboard
        if (isAdmin) {
            const response = NextResponse.redirect(`${baseUrl}/dashboard/admin`);
            response.cookies.set('admin-session', JSON.stringify(session), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });
            return response;
        }
        
        // Non-admin users - redirect to home
        return NextResponse.redirect(`${baseUrl}/`);
        
    } catch (error) {
        console.error('OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}/?error=oauth_error`);
    }
}
