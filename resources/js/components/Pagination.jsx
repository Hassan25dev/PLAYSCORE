import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    // Handle both Laravel pagination formats
    if (typeof links === 'object' && !Array.isArray(links)) {
        // Handle object format (total, per_page, current_page, last_page)
        const { current_page, last_page } = links;
        
        if (last_page <= 1) {
            return null;
        }
        
        const pageLinks = [];
        
        // Previous link
        pageLinks.push({
            url: current_page > 1 ? `?page=${current_page - 1}` : null,
            label: '&laquo; Previous',
            active: false
        });
        
        // Page links
        const maxPages = 5;
        let startPage = Math.max(1, current_page - Math.floor(maxPages / 2));
        let endPage = Math.min(last_page, startPage + maxPages - 1);
        
        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageLinks.push({
                url: `?page=${i}`,
                label: i.toString(),
                active: i === current_page
            });
        }
        
        // Next link
        pageLinks.push({
            url: current_page < last_page ? `?page=${current_page + 1}` : null,
            label: 'Next &raquo;',
            active: false
        });
        
        links = pageLinks;
    } else if (!Array.isArray(links)) {
        return null;
    }
    
    // If there's only one page, don't render pagination
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center mt-6">
            <div className="flex flex-wrap -mb-1">
                {links.map((link, key) => {
                    // Don't render "Next &raquo;" or "&laquo; Previous" as buttons
                    if (link.label.includes('Previous') || link.label.includes('Next')) {
                        return (
                            <React.Fragment key={key}>
                                {link.url && (
                                    <Link
                                        href={link.url}
                                        className={`mr-1 mb-1 px-4 py-2 text-sm border rounded ${
                                            link.url
                                                ? 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                                : 'text-gray-400 border-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        {link.label.replace('&laquo; ', '').replace(' &raquo;', '')}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    }

                    return (
                        <Link
                            key={key}
                            href={link.url}
                            className={`mr-1 mb-1 px-4 py-2 text-sm border rounded ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                            } ${!link.url && 'text-gray-400 cursor-not-allowed'}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
