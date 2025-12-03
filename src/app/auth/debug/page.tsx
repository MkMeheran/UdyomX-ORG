'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DebugInfo {
    session: {
        exists: boolean;
        data: any;
        error?: string;
    };
    cookies: {
        hasAdminSession: boolean;
    };
    environment: {
        adminEmail: string;
        supabaseUrl: string;
        hasGoogleClientId: boolean;
    };
    checks: {
        name: string;
        status: 'pass' | 'fail' | 'warning';
        message: string;
    }[];
}

export default function DebugPage() {
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [rawApiResponse, setRawApiResponse] = useState<any>(null);

    useEffect(() => {
        runDiagnostics();
    }, []);

    const runDiagnostics = async () => {
        setIsLoading(true);
        const checks: DebugInfo['checks'] = [];
        let sessionData = null;
        let sessionError = null;

        // 1. Check Session API
        try {
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            setRawApiResponse(data);
            sessionData = data.session;
            
            if (sessionData) {
                checks.push({
                    name: 'Session Exists',
                    status: 'pass',
                    message: `Logged in as ${sessionData.email}`
                });

                // Check admin status
                if (sessionData.isAdmin) {
                    checks.push({
                        name: 'Admin Status',
                        status: 'pass',
                        message: 'You have admin privileges'
                    });
                } else {
                    checks.push({
                        name: 'Admin Status',
                        status: 'warning',
                        message: 'You are logged in but NOT as admin'
                    });
                }
            } else {
                checks.push({
                    name: 'Session Exists',
                    status: 'fail',
                    message: 'No active session found - you need to login'
                });
            }
        } catch (error: any) {
            sessionError = error.message;
            checks.push({
                name: 'Session API',
                status: 'fail',
                message: `Failed to fetch session: ${error.message}`
            });
        }

        // 2. Check Debug Session API
        try {
            const res = await fetch('/api/debug/session');
            const data = await res.json();
            
            if (data.isMatch === true) {
                checks.push({
                    name: 'Email Match',
                    status: 'pass',
                    message: 'Your email matches the admin email'
                });
            } else if (data.isMatch === false) {
                checks.push({
                    name: 'Email Match',
                    status: 'fail',
                    message: `Email mismatch! Your: ${data.sessionEmail}, Expected: ${data.expectedAdminEmail}`
                });
            }

            // Store environment info
            if (data.expectedAdminEmail) {
                checks.push({
                    name: 'Admin Email Config',
                    status: 'pass',
                    message: `Admin email is set to: ${data.expectedAdminEmail}`
                });
            }
        } catch (error) {
            checks.push({
                name: 'Debug API',
                status: 'warning',
                message: 'Could not fetch debug info'
            });
        }

        // 3. Check if cookies are working
        const hasAdminSession = document.cookie.includes('admin-session');
        if (sessionData && !hasAdminSession) {
            checks.push({
                name: 'Cookie Access',
                status: 'warning',
                message: 'Session exists but cookie is httpOnly (this is normal and secure)'
            });
        }

        // 4. Check Google OAuth
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (googleClientId) {
            checks.push({
                name: 'Google OAuth Config',
                status: 'pass',
                message: 'Google Client ID is configured'
            });
        } else {
            checks.push({
                name: 'Google OAuth Config',
                status: 'fail',
                message: 'Google Client ID is NOT configured (NEXT_PUBLIC_GOOGLE_CLIENT_ID)'
            });
        }

        // 5. Test Dashboard Access
        if (sessionData?.isAdmin) {
            checks.push({
                name: 'Dashboard Access',
                status: 'pass',
                message: 'You should be able to access /dashboard/admin'
            });
        } else if (sessionData) {
            checks.push({
                name: 'Dashboard Access',
                status: 'fail',
                message: 'You cannot access admin dashboard - not an admin'
            });
        } else {
            checks.push({
                name: 'Dashboard Access',
                status: 'fail',
                message: 'You cannot access admin dashboard - not logged in'
            });
        }

        setDebugInfo({
            session: {
                exists: !!sessionData,
                data: sessionData,
                error: sessionError || undefined
            },
            cookies: {
                hasAdminSession
            },
            environment: {
                adminEmail: 'mdmokammelmorshed@gmail.com',
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
                hasGoogleClientId: !!googleClientId
            },
            checks
        });

        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass': return 'bg-green-100 border-green-600 text-green-700';
            case 'fail': return 'bg-red-100 border-red-600 text-red-700';
            case 'warning': return 'bg-yellow-100 border-yellow-600 text-yellow-700';
            default: return 'bg-gray-100 border-gray-600 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass': return '✅';
            case 'fail': return '❌';
            case 'warning': return '⚠️';
            default: return '❓';
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F1E8] p-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 pt-8">
                    <h1 className="text-3xl font-black text-[#2C2416] mb-2">
                        🔧 Authentication Debug
                    </h1>
                    <p className="text-[#2C2416]/70">
                        Diagnose login and authentication issues
                    </p>
                </div>

                {isLoading ? (
                    <div className="bg-white border-4 border-[#2C2416] p-8 shadow-[8px_8px_0px_0px_#2C2416] text-center">
                        <div className="w-12 h-12 border-4 border-[#2C2416] border-t-[#F5C542] rounded-full animate-spin mx-auto mb-4" />
                        <p className="font-bold text-[#2C2416]">Running diagnostics...</p>
                    </div>
                ) : debugInfo && (
                    <>
                        {/* Summary */}
                        <div className="bg-white border-4 border-[#2C2416] p-6 mb-6 shadow-[8px_8px_0px_0px_#2C2416]">
                            <h2 className="font-bold text-xl text-[#2C2416] mb-4">📋 Diagnostic Results</h2>
                            
                            <div className="space-y-3">
                                {debugInfo.checks.map((check, index) => (
                                    <div 
                                        key={index}
                                        className={`p-3 border-2 ${getStatusColor(check.status)}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-lg">{getStatusIcon(check.status)}</span>
                                            <div>
                                                <p className="font-bold">{check.name}</p>
                                                <p className="text-sm opacity-80">{check.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Session Details */}
                        {debugInfo.session.data && (
                            <div className="bg-white border-4 border-[#2C2416] p-6 mb-6 shadow-[8px_8px_0px_0px_#2C2416]">
                                <h2 className="font-bold text-xl text-[#2C2416] mb-4">👤 Session Details</h2>
                                <div className="bg-[#2C2416] text-green-400 p-4 font-mono text-sm overflow-x-auto">
                                    <pre>{JSON.stringify(debugInfo.session.data, null, 2)}</pre>
                                </div>
                            </div>
                        )}

                        {/* Raw API Response */}
                        <div className="bg-white border-4 border-[#2C2416] p-6 mb-6 shadow-[8px_8px_0px_0px_#2C2416]">
                            <h2 className="font-bold text-xl text-[#2C2416] mb-4">📡 Raw API Response</h2>
                            <p className="text-sm text-[#2C2416]/70 mb-2">/api/auth/session</p>
                            <div className="bg-[#2C2416] text-green-400 p-4 font-mono text-sm overflow-x-auto">
                                <pre>{JSON.stringify(rawApiResponse, null, 2)}</pre>
                            </div>
                        </div>

                        {/* Recommended Actions */}
                        <div className="bg-white border-4 border-[#2C2416] p-6 mb-6 shadow-[8px_8px_0px_0px_#2C2416]">
                            <h2 className="font-bold text-xl text-[#2C2416] mb-4">💡 Recommended Actions</h2>
                            
                            <div className="space-y-3">
                                {!debugInfo.session.exists && (
                                    <div className="p-3 bg-blue-50 border-2 border-blue-300">
                                        <p className="font-bold text-blue-700">Login Required</p>
                                        <p className="text-sm text-blue-600">You need to login first. Use the button below.</p>
                                    </div>
                                )}
                                
                                {debugInfo.session.exists && !debugInfo.session.data?.isAdmin && (
                                    <div className="p-3 bg-orange-50 border-2 border-orange-300">
                                        <p className="font-bold text-orange-700">Wrong Account</p>
                                        <p className="text-sm text-orange-600">
                                            You are logged in with the wrong email. 
                                            Logout and login with: <strong>mdmokammelmorshed@gmail.com</strong>
                                        </p>
                                    </div>
                                )}

                                {debugInfo.session.data?.isAdmin && (
                                    <div className="p-3 bg-green-50 border-2 border-green-300">
                                        <p className="font-bold text-green-700">All Good!</p>
                                        <p className="text-sm text-green-600">
                                            You are logged in as admin. You can access the dashboard.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <button
                                onClick={runDiagnostics}
                                className="bg-[#2C2416] text-white font-bold py-2 px-4 border-4 border-[#2C2416] hover:bg-[#3d3520] transition-all"
                            >
                                🔄 Re-run Diagnostics
                            </button>
                            
                            <Link
                                href="/auth/relogin"
                                className="bg-[#F5C542] text-[#2C2416] font-bold py-2 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                🔐 Go to Re-Login Page
                            </Link>

                            {debugInfo.session.data?.isAdmin && (
                                <Link
                                    href="/dashboard/admin"
                                    className="bg-green-500 text-white font-bold py-2 px-4 border-4 border-[#2C2416] shadow-[4px_4px_0px_0px_#2C2416] hover:shadow-[2px_2px_0px_0px_#2C2416] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    🎛️ Go to Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </>
                )}

                {/* Back Link */}
                <div className="text-center pb-8">
                    <Link href="/" className="text-[#2C2416]/70 hover:text-[#2C2416] underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
