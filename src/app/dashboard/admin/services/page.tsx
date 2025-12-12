'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, Star, Loader2, RefreshCw } from 'lucide-react';
import { serviceAPI } from '@/lib/api';
import type { Service } from '@/types';

export default function DashboardServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await serviceAPI.getAllForAdmin();
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchServices();
    }, []);
    
    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await serviceAPI.delete(slug);
            setServices(prev => prev.filter(s => s.slug !== slug));
        } catch (error) {
            console.error('Failed to delete service:', error);
            alert('Failed to delete service');
        }
    };
    
    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const title = service.title || service.name || '';
            const description = service.description || '';
            const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [services, searchQuery, statusFilter]);
    
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#2C2416]">Services</h1>
                    <p className="text-[#2C2416]/60">{services.length} total services</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchServices}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-[#F5F1E8] text-[#2C2416] font-bold border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Link
                        href="/dashboard/admin/services/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.3)] hover:shadow-[6px_6px_0_rgba(44,36,22,0.4)] hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Service
                    </Link>
                </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white border-4 border-[#2C2416] p-4 shadow-[4px_4px_0_rgba(44,36,22,0.2)] mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2416]/40" />
                        <input
                            type="text"
                            placeholder="Search services..."
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
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>
            
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2C2416]" />
                </div>
            )}
            
            {/* Services Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredServices.length === 0 ? (
                        <div className="col-span-full bg-white border-4 border-[#2C2416] p-8 shadow-[4px_4px_0_rgba(44,36,22,0.2)] text-center text-[#2C2416]/50">
                            <p className="text-lg font-medium">No services found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters, or create a new service</p>
                        </div>
                    ) : (
                        filteredServices.map(service => (
                            <div 
                                key={service.id} 
                                className="bg-white border-4 border-[#2C2416] shadow-[4px_4px_0_rgba(44,36,22,0.2)] group hover:shadow-[6px_6px_0_rgba(44,36,22,0.3)] transition-all"
                            >
                                {/* Image */}
                                <div className="h-40 bg-[#F5F1E8] border-b-4 border-[#2C2416] overflow-hidden relative">
                                    {service.thumbnail ? (
                                        <img 
                                            src={service.thumbnail} 
                                            alt={service.title || 'Service'} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#2C2416]/30">
                                            No Image
                                        </div>
                                    )}
                                    {/* Status Badge */}
                                    <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold border-2 border-[#2C2416] ${
                                        service.status === 'published' ? 'bg-green-400' : 
                                        service.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400'
                                    }`}>
                                        {service.status}
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-black text-[#2C2416] truncate">{service.title || service.name}</h3>
                                    </div>
                                    
                                    <p className="text-sm text-[#2C2416]/60 line-clamp-2 mb-3">
                                        {service.hookLine || service.description}
                                    </p>
                                    
                                    {/* Category */}
                                    {service.category && (
                                        <div className="mb-4">
                                            <span className="px-2 py-1 bg-green-100 border-2 border-green-500 text-green-700 text-xs font-bold">
                                                {service.category}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-3 border-t-2 border-[#2C2416]/10 flex-wrap">
                                        <Link
                                            href={`/services/${service.slug}`}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-[#F5C542] transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/dashboard/admin/services/${service.slug}/edit`}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-green-200 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(service.slug)}
                                            className="p-2 bg-[#F5F1E8] border-2 border-[#2C2416] hover:bg-red-200 transition-colors ml-auto"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
