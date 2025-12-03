'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function UnauthorizedPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center px-4 py-12">
            {/* Background Pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        #2C2416 0px,
                        #2C2416 1px,
                        transparent 1px,
                        transparent 40px
                    ),
                    repeating-linear-gradient(
                        90deg,
                        #2C2416 0px,
                        #2C2416 1px,
                        transparent 1px,
                        transparent 40px
                    )`
                }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-red-400 border-4 border-[#2C2416] -z-10" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-red-300 border-4 border-[#2C2416] -z-10" />

                {/* Main Card */}
                <div className="bg-white border-4 border-[#2C2416] shadow-[8px_8px_0_rgba(44,36,22,0.4)] p-8">
                    {/* Icon */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 border-4 border-red-500 rounded-full">
                            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-black text-[#2C2416] mb-2">
                            Access Denied
                        </h1>
                        <p className="text-[#2C2416]/60 font-medium">
                            You don't have permission to access the admin dashboard.
                        </p>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="p-4 bg-[#F5F1E8] border-2 border-[#2C2416]/20 mb-6">
                            <div className="flex items-center gap-3">
                                {user.picture && (
                                    <img 
                                        src={user.picture} 
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full border-2 border-[#2C2416]"
                                    />
                                )}
                                <div>
                                    <p className="font-bold text-[#2C2416]">{user.name}</p>
                                    <p className="text-sm text-[#2C2416]/60">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div className="p-4 bg-yellow-50 border-4 border-yellow-500 mb-6">
                        <p className="text-sm text-yellow-800 font-medium">
                            <span className="font-bold">⚠️ Admin Only:</span><br />
                            This dashboard is restricted to authorized administrators only. 
                            If you believe you should have access, please contact the site owner.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link 
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#F5C542] border-4 border-[#2C2416] font-bold shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all"
                        >
                            <span>←</span>
                            Go to Homepage
                        </Link>
                        
                        <button
                            onClick={signOut}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-4 border-[#2C2416] font-bold shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:bg-red-50 hover:border-red-500 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
