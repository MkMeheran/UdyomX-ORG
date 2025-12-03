'use client';

import { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';

// Mock orders data - in production this would come from API
const mockOrders = [
    { 
        id: 'ORD-001', 
        service: 'Web Development', 
        package: 'Professional',
        status: 'in-progress', 
        date: '2024-01-15',
        amount: '$2,500',
        description: 'Full-stack web application with React and Node.js',
        progress: 65
    },
    { 
        id: 'ORD-002', 
        service: 'UI/UX Design', 
        package: 'Basic',
        status: 'completed', 
        date: '2024-01-10',
        amount: '$1,200',
        description: 'Mobile app UI design with 10 screens',
        progress: 100
    },
    { 
        id: 'ORD-003', 
        service: 'SEO Optimization', 
        package: 'Standard',
        status: 'pending', 
        date: '2024-01-18',
        amount: '$800',
        description: 'Technical SEO audit and optimization',
        progress: 0
    },
];

export default function MyOrdersPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    
    const filteredOrders = filter === 'all' 
        ? mockOrders 
        : mockOrders.filter(o => o.status === filter);
    
    const statusConfig = {
        'pending': { label: 'Pending', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: Clock },
        'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Package },
        'completed': { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
        'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
    };
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-[#2C2416] mb-2">My Orders</h1>
                <p className="text-[#2C2416]/60">Track and manage your service orders.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 font-bold border-4 transition-all ${
                            filter === status
                                ? 'bg-[#F5C542] text-[#2C2416] border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)]'
                                : 'bg-white text-[#2C2416]/60 border-[#2C2416]/20 hover:border-[#2C2416]/40'
                        }`}
                    >
                        {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>
            
            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                            <div 
                                key={order.id}
                                className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                            >
                                <div className="p-4 lg:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-[#2C2416]">{order.service}</h3>
                                                <span className={`px-2 py-1 text-xs font-bold border-2 ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#2C2416]/60">
                                                {order.id} • {order.package} Package • Ordered on {order.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-[#2C2416]">{order.amount}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[#2C2416]/70 mb-4">{order.description}</p>
                                    
                                    {/* Progress Bar */}
                                    {order.status !== 'pending' && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-[#2C2416]">Progress</span>
                                                <span className="text-sm font-bold text-[#2C2416]">{order.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-[#F5F1E8] border-2 border-[#2C2416]">
                                                <div 
                                                    className="h-full bg-[#F5C542] transition-all"
                                                    style={{ width: `${order.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 font-bold text-[#2C2416] bg-[#F5F1E8] border-4 border-[#2C2416]/20 hover:border-[#2C2416]/40 transition-all">
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 font-bold text-[#2C2416] bg-[#F5F1E8] border-4 border-[#2C2416]/20 hover:border-[#2C2416]/40 transition-all">
                                            <MessageSquare className="w-4 h-4" />
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white border-4 border-[#2C2416] p-12 text-center shadow-[4px_4px_0_rgba(44,36,22,0.2)]">
                        <Package className="w-16 h-16 mx-auto mb-4 text-[#2C2416]/30" />
                        <h3 className="text-xl font-black text-[#2C2416] mb-2">No orders found</h3>
                        <p className="text-[#2C2416]/60">
                            {filter === 'all' 
                                ? "You haven't placed any orders yet."
                                : `No ${filter.replace('-', ' ')} orders.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
