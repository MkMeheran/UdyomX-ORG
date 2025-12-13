/**
 * Slug Utilities - Helper functions for content management
 */

// Generate a unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a slug from text
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Alias for generateSlug
export function generateSlugFromTitle(title: string): string {
    return generateSlug(title);
}

// Validate slug format
export function isValidSlug(slug: string): boolean {
    if (!slug || slug.length < 2) return false;
    // Only lowercase letters, numbers, and hyphens
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// Generate a unique slug by checking against existing slugs
export async function generateUniqueSlug(
    text: string, 
    existingSlugs: string[], 
    currentSlug?: string
): Promise<string> {
    const slugList = Array.isArray(existingSlugs) ? existingSlugs : [];
    const slug = generateSlug(text);
    
    // If it's the same as current slug, no change needed
    if (currentSlug && slug === currentSlug) {
        return slug;
    }
    
    // Check if slug exists
    if (!slugList.includes(slug)) {
        return slug;
    }
    
    // Add number suffix to make unique
    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (slugList.includes(newSlug)) {
        counter++;
        newSlug = `${slug}-${counter}`;
    }
    
    return newSlug;
}

// Get all slugs from API
export async function getAllSlugs(): Promise<{
    blogs: string[];
    projects: string[];
    services: string[];
}> {
    try {
        const [blogs, projects, services] = await Promise.all([
            fetch('/api/blogs').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/projects').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/services').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);
        
        return {
            blogs: blogs.map((b: any) => b.slug),
            projects: projects.map((p: any) => p.slug),
            services: services.map((s: any) => s.slug)
        };
    } catch {
        return { blogs: [], projects: [], services: [] };
    }
}

// Helper: get slugs for a single type
export async function getSlugsByType(type: 'post' | 'project' | 'service'): Promise<string[]> {
    const all = await getAllSlugs();
    if (type === 'post') return all.blogs || [];
    if (type === 'project') return all.projects || [];
    return all.services || [];
}

// Calculate read time from content
export function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    return `${minutes} min`;
}

// Extract headings from content for TOC
export function extractHeadingsFromContent(content: string): Array<{
    id: string;
    text: string;
    level: number;
}> {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const usedIds = new Set<string>();
    
    // Helper to generate unique ID
    const getUniqueId = (baseId: string): string => {
        if (!usedIds.has(baseId)) {
            usedIds.add(baseId);
            return baseId;
        }
        
        let counter = 1;
        let uniqueId = `${baseId}-${counter}`;
        while (usedIds.has(uniqueId)) {
            counter++;
            uniqueId = `${baseId}-${counter}`;
        }
        usedIds.add(uniqueId);
        return uniqueId;
    };
    
    // Match markdown headings (## or ###)
    const mdRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    
    while ((match = mdRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const baseId = generateSlug(text);
        const id = getUniqueId(baseId);
        headings.push({ id, text, level });
    }
    
    // Also match HTML headings
    const htmlRegex = /<h([2-3])[^>]*>([^<]+)<\/h[2-3]>/gi;
    while ((match = htmlRegex.exec(content)) !== null) {
        const level = parseInt(match[1]);
        const text = match[2].trim();
        const baseId = generateSlug(text);
        const id = getUniqueId(baseId);
        headings.push({ id, text, level });
    }
    
    return headings;
}

// Check if slug exists
export async function checkSlugExists(
    slug: string, 
    type: 'blog' | 'project' | 'service'
): Promise<boolean> {
    try {
        const endpoint = type === 'blog' ? 'blogs' : type === 'project' ? 'projects' : 'services';
        const res = await fetch(`/api/${endpoint}/${slug}`);
        return res.ok;
    } catch {
        return false;
    }
}

// Check slug availability (returns object with availability status)
export async function checkSlugAvailability(
    slug: string,
    type: 'post' | 'project' | 'service',
    excludeId?: string
): Promise<{ available: boolean; message?: string }> {
    if (!isValidSlug(slug)) {
        return { available: false, message: 'Invalid slug format' };
    }
    
    try {
        const endpoint = type === 'post' ? 'blogs' : type === 'project' ? 'projects' : 'services';
        const res = await fetch(`/api/${endpoint}/${slug}`);
        
        if (!res.ok) {
            return { available: true };
        }
        
        const data = await res.json();
        // If excludeId is provided and matches, it's available (editing same item)
        if (excludeId && data.id === excludeId) {
            return { available: true };
        }
        
        return { available: false, message: 'Slug already exists' };
    } catch {
        return { available: true }; // Assume available if API fails
    }
}

// Suggest alternative slugs
export async function suggestAlternativeSlugs(
    baseSlug: string,
    type: 'post' | 'project' | 'service'
): Promise<string[]> {
    const suggestions: string[] = [];
    
    for (let i = 1; i <= 5; i++) {
        const suggested = `${baseSlug}-${i}`;
        const { available } = await checkSlugAvailability(suggested, type);
        if (available) {
            suggestions.push(suggested);
            if (suggestions.length >= 3) break;
        }
    }
    
    // Add date-based suggestion
    const dateSlug = `${baseSlug}-${new Date().getFullYear()}`;
    const { available } = await checkSlugAvailability(dateSlug, type);
    if (available && !suggestions.includes(dateSlug)) {
        suggestions.push(dateSlug);
    }
    
    return suggestions;
}

// Get all content slugs (for recommended editor)
export async function getAllContentSlugs(): Promise<Array<{
    slug: string;
    type: 'post' | 'project' | 'service';
    title: string;
}>> {
    const results: Array<{ slug: string; type: 'post' | 'project' | 'service'; title: string }> = [];
    
    try {
        const [blogs, projects, services] = await Promise.all([
            fetch('/api/blogs').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/projects').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/api/services').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);
        
        blogs.forEach((b: any) => results.push({ slug: b.slug, type: 'post', title: b.title }));
        projects.forEach((p: any) => results.push({ slug: p.slug, type: 'project', title: p.name }));
        services.forEach((s: any) => results.push({ slug: s.slug, type: 'service', title: s.title || s.name }));
    } catch {
        // Return empty if API fails
    }
    
    return results;
}
