'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock, DollarSign, Package, Mail } from 'lucide-react';

// Sample orders data (empty for now)
const sampleOrders: any[] = [];

export default function DashboardOrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const stats = [
        { label: 'Total Orders', value: sampleOrders.length, icon: Package, color: 'bg-blue-100 text-blue-700' },
        { label: 'Pending', value: sampleOrders.filter(o => o.status === 'pending').length, icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
        { label: 'Completed', value: sampleOrders.filter(o => o.status === 'completed').length, icon: Check, color: 'bg-green-100 text-green-700' },
        { label: 'Revenue', value: `$${sampleOrders.reduce((sum, o) => sum + (o.total || 0), 0)}`, icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
    ];
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-black text-[#2C2416]">Orders</h1>
                <p className="text-[#2C2416]/60">Manage customer orders and requests</p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div 
                        key={label}
                        className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 border-2 border-[#2C2416] ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-[#2C2416]">{value}</p>
                                <p className="text-xs font-medium text-[#2C2416]/60">{label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Filters */}
            <div className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)] mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40" />
                        <input
                            type="text"
                            placeholder="Search orders by ID, customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542]"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 border-3 border-[#2C2416] bg-[#F5F1E8] font-medium text-[#2C2416] focus:outline-none focus:ring-2 focus:ring-[#F5C542] appearance-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            
            {/* Orders List */}
            <div className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)] overflow-hidden">
                {sampleOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-[#F5F1E8] border-4 border-[#2C2416] flex items-center justify-center">
                            <Package className="w-10 h-10 text-[#2C2416]/40" />
                        </div>
                        <h3 className="text-xl font-black text-[#2C2416] mb-2">No Orders Yet</h3>
                        <p className="text-[#2C2416]/60 mb-4">
                            When customers place orders for your services, they will appear here.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-[#2C2416]/50">
                            <Mail className="w-4 h-4" />
                            <span>Orders will be sent to your email as well</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 bg-[#F5F1E8] border-b-4 border-[#2C2416] font-bold text-[#2C2416]">
                            <div className="col-span-2">Order ID</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-3">Service</div>
                            <div className="col-span-1">Total</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Actions</div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="divide-y-2 divide-[#2C2416]/10">
                            {sampleOrders.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-[#F5F1E8]/50 transition-colors">
                                    <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                                        {/* Order ID */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            <span className="font-mono font-bold text-[#2C2416]">#{order.id}</span>
                                        </div>
                                        
                                        {/* Customer */}
                                        <div className="col-span-3 mb-2 lg:mb-0">
                                            <p className="font-bold text-[#2C2416]">{order.customerName}</p>
                                            <p className="text-sm text-[#2C2416]/50">{order.customerEmail}</p>
                                        </div>
                                        
                                        {/* Service */}
                                        <div className="col-span-3 mb-2 lg:mb-0">
                                            <p className="font-medium text-[#2C2416]">{order.serviceName}</p>
                                            <p className="text-sm text-[#2C2416]/50">{order.packageName}</p>
                                        </div>
                                        
                                        {/* Total */}
                                        <div className="col-span-1 mb-2 lg:mb-0">
                                            <span className="font-bold text-green-600">${order.total}</span>
                                        </div>
                                        
                                        {/* Status */}
                                        <div className="col-span-2 mb-2 lg:mb-0">
                                            <span className={`inline-block px-2 py-1 text-xs font-bold border-2 ${
                                                order.status === 'completed' 
                                                    ? 'bg-green-100 border-green-500 text-green-700' 
                                                    : order.status === 'pending'
                                                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                                    : order.status === 'in-progress'
                                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                                    : 'bg-red-100 border-red-500 text-red-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center gap-2">
                                            <button
                                                className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-[#F5C542] transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-green-200 transition-colors"
                                                title="Mark Complete"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
