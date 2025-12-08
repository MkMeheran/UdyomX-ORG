// ============================================
// DEFAULT CONTACT CONFIGURATION
// ============================================
// This file stores the default contact information
// that will be used across all services unless 
// a service has custom contact info specified.

export interface ContactInfo {
    whatsapp?: string;
    telegram?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    email?: string;
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT CONTACT INFO - Update this with your actual info
// ═══════════════════════════════════════════════════════════════
export const defaultContactInfo: ContactInfo = {
    // WhatsApp: Use format +880XXXXXXXXXX (with country code)
    whatsapp: '+8801884655417',
    
    // Telegram: Use @username or https://t.me/username
    telegram: '+8801884655417',
    
    // Twitter/X: Use @username or https://twitter.com/username
    twitter: 'Meheran_3005',
    
    // Instagram: Use @username or https://instagram.com/username
    instagram: 'mokammel_morshed',
    
    // Facebook: Use page URL or username
    facebook: 'Meheran216',
    
    // LinkedIn: Use profile/company URL
    linkedin: 'mokammel-morshed',
    
    // Email: Your contact email
    email: 'mdmokammelmorshed@gmail.com',
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Generate WhatsApp URL from phone number
 */
export function getWhatsAppUrl(phone: string): string {
    // Remove all non-numeric characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanPhone.replace('+', '')}`;
}

/**
 * Generate Telegram URL from username
 */
export function getTelegramUrl(username: string): string {
    if (username.startsWith('http')) return username;
    const cleanUsername = username.replace('@', '');
    return `https://t.me/${cleanUsername}`;
}

/**
 * Generate Twitter URL from username
 */
export function getTwitterUrl(username: string): string {
    if (username.startsWith('http')) return username;
    const cleanUsername = username.replace('@', '');
    return `https://twitter.com/${cleanUsername}`;
}

/**
 * Generate Instagram URL from username
 */
export function getInstagramUrl(username: string): string {
    if (username.startsWith('http')) return username;
    const cleanUsername = username.replace('@', '');
    return `https://instagram.com/${cleanUsername}`;
}

/**
 * Generate Facebook URL from page name
 */
export function getFacebookUrl(page: string): string {
    if (page.startsWith('http')) return page;
    return `https://facebook.com/${page}`;
}

/**
 * Generate LinkedIn URL from profile/company
 */
export function getLinkedInUrl(profile: string): string {
    if (profile.startsWith('http')) return profile;
    return `https://linkedin.com/${profile}`;
}

/**
 * Merge custom contact info with defaults
 * Custom values override defaults when provided
 */
export function mergeContactInfo(customInfo?: Partial<ContactInfo>): ContactInfo {
    if (!customInfo) return defaultContactInfo;
    
    return {
        whatsapp: customInfo.whatsapp || defaultContactInfo.whatsapp,
        telegram: customInfo.telegram || defaultContactInfo.telegram,
        twitter: customInfo.twitter || defaultContactInfo.twitter,
        instagram: customInfo.instagram || defaultContactInfo.instagram,
        facebook: customInfo.facebook || defaultContactInfo.facebook,
        linkedin: customInfo.linkedin || defaultContactInfo.linkedin,
        email: customInfo.email || defaultContactInfo.email,
    };
}

/**
 * Convert ContactInfo to social links array for Contact page
 */
export function contactInfoToSocialLinks(info: ContactInfo) {
    const links = [];
    
    if (info.whatsapp) {
        links.push({
            id: 'whatsapp',
            name: 'WhatsApp',
            description: 'Fast response, instant messaging',
            href: getWhatsAppUrl(info.whatsapp),
            color: 'bg-[#25D366]',
            hoverColor: 'hover:bg-[#128C7E]',
            textColor: 'text-white',
        });
    }
    
    if (info.telegram) {
        links.push({
            id: 'telegram',
            name: 'Telegram',
            description: 'Secure & fast communication',
            href: getTelegramUrl(info.telegram),
            color: 'bg-[#0088CC]',
            hoverColor: 'hover:bg-[#006699]',
            textColor: 'text-white',
        });
    }
    
    if (info.twitter) {
        links.push({
            id: 'twitter',
            name: 'Twitter / X',
            description: 'DM us for quick queries',
            href: getTwitterUrl(info.twitter),
            color: 'bg-[#000000]',
            hoverColor: 'hover:bg-[#333333]',
            textColor: 'text-white',
        });
    }
    
    if (info.instagram) {
        links.push({
            id: 'instagram',
            name: 'Instagram',
            description: 'See our work & DM us',
            href: getInstagramUrl(info.instagram),
            color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
            hoverColor: 'hover:opacity-90',
            textColor: 'text-white',
        });
    }
    
    if (info.facebook) {
        links.push({
            id: 'facebook',
            name: 'Facebook',
            description: 'Message us on Facebook',
            href: getFacebookUrl(info.facebook),
            color: 'bg-[#1877F2]',
            hoverColor: 'hover:bg-[#0D65D9]',
            textColor: 'text-white',
        });
    }
    
    if (info.linkedin) {
        links.push({
            id: 'linkedin',
            name: 'LinkedIn',
            description: 'Professional inquiries',
            href: getLinkedInUrl(info.linkedin),
            color: 'bg-[#0A66C2]',
            hoverColor: 'hover:bg-[#004182]',
            textColor: 'text-white',
        });
    }
    
    return links;
}
