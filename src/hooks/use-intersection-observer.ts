'use client';

import { useEffect, useState, RefObject } from 'react';

export function useIntersectionObserver(
    elementRefs: RefObject<HTMLElement>[],
    options?: IntersectionObserverInit
): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-80px 0px -80% 0px',
            ...options,
        });

        elementRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            elementRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [elementRefs, options]);

    return activeId;
}
