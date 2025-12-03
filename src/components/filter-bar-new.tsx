'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
    onSearch?: (query: string) => void;
    onSort?: (sort: string) => void;
    onCategory?: (category: string) => void;
    onClear?: () => void;
    categories?: string[];
    sortOptions?: { value: string; label: string }[];
}

export function FilterBar({
    onSearch,
    onSort,
    onCategory,
    onClear,
    categories = ['All', 'Technology', 'Design', 'Business'],
    sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'popular', label: 'Most Popular' },
    ],
}: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortValue, setSortValue] = useState('latest');
    const [categoryValue, setCategoryValue] = useState('all');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleSort = (sort: string) => {
        setSortValue(sort);
        onSort?.(sort);
    };

    const handleCategory = (category: string) => {
        setCategoryValue(category);
        onCategory?.(category);
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
                        onChange={(e) => handleSort(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F5F0] border-3 border-[#1A1A1A] focus:outline-none focus:border-[#2196F3] transition-all font-semibold text-[#1A1A1A]"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <span className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wider">Categories:</span>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategory(category.toLowerCase())}
                        className={`px-4 py-2 border-3 border-black font-bold text-sm uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                            categoryValue === category.toLowerCase()
                                ? 'bg-[#2196F3] text-white'
                                : 'bg-white text-[#1A1A1A]'
                        }`}
                    >
                        {category}
                    </button>
                ))}
                <button
                    onClick={handleClear}
                    className="ml-auto px-4 py-2 bg-[#FF6B6B] text-white border-3 border-black font-bold text-sm uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Clear
                </button>
            </div>
        </div>
    );
}
