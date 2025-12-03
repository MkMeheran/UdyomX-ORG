'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

function GoogleAuthContent() {
    const searchParams = useSearchParams();
    const isAdmin = searchParams.get('admin') === 'true';
    
    useEffect(() => {
        // Build Google OAuth URL
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const scope = 'email profile';
        const state = isAdmin ? 'admin' : '';
        
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${state}` +
            `&access_type=offline` +
            `&prompt=consent`;
        
        // Redirect to Google
        window.location.href = googleAuthUrl;
    }, [isAdmin]);
    
    return (
        <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
            <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[8px_8px_0_rgba(44,36,22,0.3)]">
                <div className="w-12 h-12 border-4 border-[#F5F1E8] border-t-[#F5C542] rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-black text-[#2C2416] text-center">Redirecting to Google...</h2>
                <p className="text-[#2C2416]/60 text-center mt-2">Please wait</p>
            </div>
        </div>
    );
}

export default function GoogleAuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
                <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[8px_8px_0_rgba(44,36,22,0.3)]">
                    <div className="w-12 h-12 border-4 border-[#F5F1E8] border-t-[#F5C542] rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-black text-[#2C2416] text-center">Loading...</h2>
                </div>
            </div>
        }>
            <GoogleAuthContent />
        </Suspense>
    );
}
