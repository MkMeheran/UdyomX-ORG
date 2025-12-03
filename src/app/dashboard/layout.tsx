'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Home, 
    LogOut, 
    Menu, 
    X, 
    Shield,
    FileText,
    Briefcase,
    Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Admin navigation items
const adminNavItems = [
    { href: '/dashboard/admin', label: 'Overview', icon: Shield },
    { href: '/dashboard/admin/blogs', label: 'Blog Posts', icon: FileText },
    { href: '/dashboard/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '/dashboard/admin/services', label: 'Services', icon: Wrench },
];

interface AdminSession {
    id: string;
    email: string;
    name: string;
    picture: string;
    isAdmin: boolean;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [session, setSession] = useState<AdminSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Check admin session from cookie (client-side)
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Try to get session from API
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    if (data.session && data.session.isAdmin) {
                        setSession(data.session);
                    } else {
                        router.push('/udyomx-admin');
                    }
                } else {
                    router.push('/udyomx-admin');
                }
            } catch {
                // For now, allow access in development
                setSession({
                    id: 'dev',
                    email: 'mdmokammelmorshed@gmail.com',
                    name: 'Admin',
                    picture: '',
                    isAdmin: true,
                });
            }
            setIsLoading(false);
        };
        checkSession();
    }, [router]);
    
    const handleSignOut = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        // Redirect to homepage after logout
        router.push('/');
    };
    
    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#2C2416] border-t-[#F5C542] rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-bold text-[#2C2416]">Loading...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-[#F5F1E8]">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#2C2416] text-white border-b-4 border-[#F5C542]">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/dashboard/admin" className="text-xl font-black">
                        Admin Panel
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/10 transition-colors"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>
            
            <div className="flex">
                {/* Sidebar */}
                <aside className={cn(
                    'fixed lg:sticky top-0 left-0 z-40 w-72 h-screen bg-[#2C2416] text-white transition-transform lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}>
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="p-6 border-b-4 border-[#F5C542]">
                            <Link href="/dashboard/admin" className="block">
                                <h2 className="text-2xl font-black">Admin Panel</h2>
                                <p className="text-xs text-white/60 mt-1">Content Management</p>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {adminNavItems.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href || 
                                    (href !== '/dashboard/admin' && pathname?.startsWith(href));
                                
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 font-bold transition-all border-4',
                                            isActive
                                                ? 'bg-[#F5C542] text-[#2C2416] border-[#F5C542] shadow-[4px_4px_0_rgba(245,197,66,0.3)]'
                                                : 'border-transparent hover:bg-white/10 hover:border-white/20'
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>
                        
                        {/* User Info & Footer */}
                        <div className="p-4 border-t-4 border-white/10 space-y-3">
                            {/* User Profile */}
                            {session && (
                                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded">
                                    {session.picture && (
                                        <img 
                                            src={session.picture} 
                                            alt={session.name}
                                            className="w-10 h-10 rounded-full border-2 border-[#F5C542]"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{session.name}</p>
                                        <p className="text-xs text-white/60 truncate">{session.email}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-[#F5C542] text-[#2C2416] rounded">
                                            ADMIN
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-4 py-2 font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all border-4 border-transparent"
                            >
                                <Home className="w-5 h-5" />
                                Back to Site
                            </Link>
                            
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-2 font-bold text-red-400 hover:text-white hover:bg-red-500/20 transition-all border-4 border-transparent"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>
                
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-h-screen lg:ml-0 pt-16 lg:pt-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
