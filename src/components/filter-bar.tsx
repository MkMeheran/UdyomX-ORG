'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface FilterBarProps {
    onSearch?: (query: string) => void;
    onSort?: (value: string) => void;
    onCategoryChange?: (value: string) => void;
    onClear?: () => void;
    categories?: string[];
    showCategoryFilter?: boolean;
}

export function FilterBar({
    onSearch,
    onSort,
    onCategoryChange,
    onClear,
    categories = ['All Categories'],
    showCategoryFilter = true,
}: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortValue, setSortValue] = useState('latest');
    const [categoryValue, setCategoryValue] = useState('all');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        onSearch?.(value);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSortValue('latest');
        setCategoryValue('all');
        onClear?.();
    };

    return (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A5A] z-10" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F5F0] border-3 border-[#1A1A1A] focus:outline-none focus:border-[#2196F3] transition-all font-semibold text-[#1A1A1A]"
                    />
                </div>

                <div className="relative">
                    <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5A5A] z-10" />
                    <select
                        value={sortValue}
                        onChange={(e) => {
                            setSortValue(e.target.value);
                            onSort?.(e.target.value);
                        }}
                        className="w-full pl-12 pr-4 py-3 border-3 border-[#1A1A1A] focus:outline-none focus:border-[#2196F3] transition-colors bg-[#F5F5F0] appearance-none font-semibold text-[#1A1A1A]"
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {showCategoryFilter && (
                    <select
                        value={categoryValue}
                        onChange={(e) => {
                            setCategoryValue(e.target.value);
                            onCategoryChange?.(e.target.value);
                        }}
                        className="px-4 py-2 border-3 border-[#1A1A1A] bg-[#F5F5F0] font-bold text-[#1A1A1A] text-sm appearance-none"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>
                                {cat}
                            </option>
                        ))}
                    </select>
                )}

                {(searchQuery || sortValue !== 'latest' || categoryValue !== 'all') && (
                    <button
                        onClick={handleClear}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] hover:translate-x-[2px] hover:translate-y-[2px] text-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black text-sm uppercase tracking-wider transition-all"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
