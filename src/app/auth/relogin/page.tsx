'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReloginPage() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentSession, setCurrentSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check current session
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                setCurrentSession(data.session);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            // Clear any cached data
            setCurrentSession(null);
            // Small delay to ensure cookie is cleared
            await new Promise(resolve => setTimeout(resolve, 500));
            // Redirect to Google login
            router.push('/auth/google?admin=true');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    const handleLoginAsAdmin = () => {
        router.push('/auth/google?admin=true');
    };

    const handleLoginAsUser = () => {
        router.push('/auth/google');
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-[#2C2416] mb-2">
                        🔄 Re-Login
                    </h1>
                    <p className="text-[#2C2416]/70">
                        Switch account or re-authenticate
                    </p>
                </div>

                {/* Current Session Card */}
                <div className="bg-white border-4 border-[#2C2416] p-6 mb-6 shadow-[8px_8px_0px_0px_#2C2416]">
                    <h2 className="font-bold text-[#2C2416] mb-4">Current Session</h2>
                    
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-[#2C2416]/60">
                            <div className="w-4 h-4 border-2 border-[#2C2416] border-t-transparent rounded-full animate-spin" />
                            Loading...
                        </div>
                    ) : currentSession ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                {currentSession.picture && (
                                    <img 
                                        src={currentSession.picture} 
                                        alt="Profile" 
                                        className="w-12 h-12 rounded-full border-2 border-[#2C2416]"
                                    />
                                )}
                                <div>
                                    <p className="font-bold text-[#2C2416]">{currentSession.name}</p>
                                    <p className="text-sm text-[#2C2416]/70">{currentSession.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`px-2 py-1 text-xs font-bold border-2 ${
                                    currentSession.isAdmin 
                                        ? 'bg-green-100 border-green-600 text-green-700' 
                                        : 'bg-yellow-100 border-yellow-600 text-yellow-700'
                                }`}>
                                    {currentSession.isAdmin ? '✓ Admin' : '○ User'}
                                </span>
                                <span className="px-2 py-1 text-xs font-bold bg-blue-100 border-2 border-blue-600 text-blue-700">
                                    Logged in
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[#2C2416]/60">
                            <p>❌ No active session</p>
                            <p className="text-sm mt-1">You are not logged in</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {currentSession ? (
                        <>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full bg-red-500 text-white font-bold py-3 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                            >
                                {isLoggingOut ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Logging out & Redirecting...
                                    </span>
                                ) : (
                                    '🚪 Logout & Login with Different Account'
                                )}
                            </button>
                            
                            {currentSession.isAdmin && (
                                <Link
                                    href="/dashboard/admin"
                                    className="block w-full bg-[#F5C542] text-[#2C2416] font-bold py-3 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                                >
                                    🎛️ Go to Admin Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLoginAsAdmin}
                                className="w-full bg-[#F5C542] text-[#2C2416] font-bold py-3 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                🔐 Login as Admin
                            </button>
                            
                            <button
                                onClick={handleLoginAsUser}
                                className="w-full bg-white text-[#2C2416] font-bold py-3 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                👤 Login as User
                            </button>
                        </>
                    )}
                </div>

                {/* Links */}
                <div className="mt-6 text-center space-y-2">
                    <Link href="/auth/debug" className="text-[#2C2416]/70 hover:text-[#2C2416] underline text-sm block">
                        🔧 Debug Authentication Issues
                    </Link>
                    <Link href="/" className="text-[#2C2416]/70 hover:text-[#2C2416] underline text-sm block">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
