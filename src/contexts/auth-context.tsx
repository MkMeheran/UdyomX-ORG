'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Admin email - only this email can access admin dashboard
const ADMIN_EMAIL = 'mdmokammelmorshed@gmail.com';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = '146758920582-eq6sv1jna5nngrscj433haefjlfm8cib.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/google/callback`
    : 'http://localhost:3000/auth/google/callback';

export interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check if user is admin
    const isAdmin = user?.email === ADMIN_EMAIL;

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('auth_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Protect authenticated routes (all logged-in users can access dashboard)
    useEffect(() => {
        if (!isLoading && pathname?.startsWith('/dashboard')) {
            if (!user) {
                router.push('/auth/login');
            }
            // Admin panel routes require admin access
            if (user && !isAdmin && pathname?.startsWith('/dashboard/admin')) {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, pathname, router, isAdmin]);

    // Google OAuth sign in
    const signInWithGoogle = useCallback(() => {
        const scope = encodeURIComponent('email profile');
        const redirectUri = encodeURIComponent(GOOGLE_REDIRECT_URI);
        const responseType = 'code';
        const accessType = 'offline';
        const prompt = 'consent';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${redirectUri}` +
            `&response_type=${responseType}` +
            `&scope=${scope}` +
            `&access_type=${accessType}` +
            `&prompt=${prompt}`;

        window.location.href = authUrl;
    }, []);

    // Sign out
    const signOut = useCallback(() => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_tokens');
        setUser(null);
        router.push('/');
    }, [router]);

    // Set user (called from callback)
    const setAuthUser = useCallback((userData: User) => {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    }, []);

    // Expose setAuthUser globally for callback
    useEffect(() => {
        (window as any).__setAuthUser = setAuthUser;
        return () => {
            delete (window as any).__setAuthUser;
        };
    }, [setAuthUser]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            isAdmin,
            signInWithGoogle, 
            signOut 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Export admin email for use in other files
export { ADMIN_EMAIL };
