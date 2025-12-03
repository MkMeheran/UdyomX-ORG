'use client';

import React, { PropsWithChildren } from 'react';
import { Playlist, PlaylistItem } from '@/types';
import Icon from '@/components/common/Icon';

const ItemCard: React.FC<{ item: PlaylistItem }> = ({ item }) => {
    const typeIcons: Record<string, React.ComponentProps<typeof Icon>['name']> = {
        post: 'FileText',
        project: 'Briefcase',
        service: 'Wrench'
    };
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col border border-gray-200">
            <div className="flex items-center text-xs text-gray-600 mb-2">
                <Icon name={typeIcons[item.type]} size={14} className="mr-2" />
                <span className="font-semibold uppercase">{item.type}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 flex-grow">{item.item.title}</h3>
            <button className="text-sm text-blue-600 hover:underline self-start">
                View Details &rarr;
            </button>
        </div>
    );
}

const FeaturedItem: React.FC<{ item: PlaylistItem }> = ({ item }) => {
     const typeIcons: Record<string, React.ComponentProps<typeof Icon>['name']> = {
        post: 'FileText',
        project: 'Briefcase',
        service: 'Wrench'
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
                <img src={item.item.coverPhoto || item.item.coverImage} alt={item.item.title} className="rounded-lg w-full h-full object-cover aspect-video" />
            </div>
            <div className="md:col-span-3">
                 <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Icon name={typeIcons[item.type]} size={16} className="mr-2" />
                    <span className="font-semibold uppercase">{item.type}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{item.item.title}</h2>
                <p className="text-gray-700 mb-4">{item.item.seo.metaDescription}</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    View Details
                </button>
            </div>
        </div>
    )
}

const CleanMagazineLayout: React.FC<PropsWithChildren<{ playlist: Playlist }>> = ({ playlist, children }) => {
    const playlistItems = playlist.items || [];
    const featuredItem = playlistItems[0];
    const gridItems = playlistItems.slice(1);

    return (
        <div className="space-y-16">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold mb-4">{playlist.title}</h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">{playlist.description}</p>
                <div className="mt-6 flex justify-center items-center gap-4">
                     <button className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-600">
                        Follow
                     </button>
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <Icon name="Share2" size={20} />
                     </button>
                </div>
            </header>

            {featuredItem && (
                 <section>
                    <FeaturedItem item={featuredItem} />
                </section>
            )}
            
            {gridItems.length > 0 && (
                 <section>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gridItems.map((item, index) => <ItemCard key={`${item.item.id}-${index}`} item={item} />)}
                     </div>
                </section>
            )}

            {/* Injected Media Content */}
            {children}
        </div>
    );
};

export default CleanMagazineLayout;
