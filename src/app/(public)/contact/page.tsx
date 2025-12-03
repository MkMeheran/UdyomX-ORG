'use client';

import { motion } from 'framer-motion';
import { 
    MessageCircle, 
    Send, 
    ArrowLeft,
    Mail,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
    defaultContactInfo, 
    mergeContactInfo, 
    contactInfoToSocialLinks,
    type ContactInfo 
} from '@/lib/contact-config';

// Social media icons as SVG components for better control
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const TelegramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
);

const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

// Icon mapping for dynamic rendering
const iconComponents: Record<string, React.ComponentType> = {
    whatsapp: WhatsAppIcon,
    telegram: TelegramIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    linkedin: LinkedInIcon,
};

function ContactPageContent() {
    const searchParams = useSearchParams();
    const serviceName = searchParams.get('service');
    const packageName = searchParams.get('package');
    
    // Custom contact info from URL params (passed from service page)
    const customWhatsApp = searchParams.get('whatsapp');
    const customTelegram = searchParams.get('telegram');
    const customTwitter = searchParams.get('twitter');
    const customInstagram = searchParams.get('instagram');
    const customFacebook = searchParams.get('facebook');
    const customLinkedIn = searchParams.get('linkedin');
    const customEmail = searchParams.get('email');
    
    // Build custom contact info if any provided
    const customInfo: Partial<ContactInfo> | undefined = (
        customWhatsApp || customTelegram || customTwitter || 
        customInstagram || customFacebook || customLinkedIn || customEmail
    ) ? {
        whatsapp: customWhatsApp || undefined,
        telegram: customTelegram || undefined,
        twitter: customTwitter || undefined,
        instagram: customInstagram || undefined,
        facebook: customFacebook || undefined,
        linkedin: customLinkedIn || undefined,
        email: customEmail || undefined,
    } : undefined;
    
    // Merge with defaults (custom overrides default)
    const contactInfo = mergeContactInfo(customInfo);
    const socialLinks = contactInfoToSocialLinks(contactInfo);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-[#F5F5F0]">
            {/* Header */}
            <div className="bg-[#2C2416] border-b-[4px] border-[#F5C542]">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href={serviceName ? `/services` : '/'}
                        className="
                            inline-flex items-center gap-2 mb-4
                            text-[#F5F1E8] hover:text-[#F5C542]
                            font-semibold transition-colors
                        "
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to {serviceName ? 'Services' : 'Home'}</span>
                    </Link>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-[#F5F1E8] mb-2">
                        Let&apos;s Connect
                    </h1>
                    <p className="text-[#A8A499] font-medium text-lg">
                        Choose your preferred way to reach us
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Service Context Banner */}
                {(serviceName || packageName) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="
                            mb-8 p-4 md:p-6
                            bg-[#F5C542]/20 border-[3px] border-[#2C2416]
                            shadow-[4px_4px_0_0_#2C2416]
                        "
                    >
                        <p className="text-[#5A5247] font-semibold text-sm mb-1">
                            You&apos;re inquiring about:
                        </p>
                        <p className="text-[#2C2416] font-black text-lg md:text-xl">
                            {serviceName}
                            {packageName && (
                                <span className="text-[#5A5247] font-semibold"> — {packageName} Package</span>
                            )}
                        </p>
                    </motion.div>
                )}

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="
                        mb-10 p-6 md:p-8
                        bg-[#F5F1E8] border-[4px] border-[#2C2416]
                        shadow-[6px_6px_0_0_rgba(44,36,22,0.4)]
                    "
                >
                    <div className="flex items-start gap-4">
                        <div className="
                            w-12 h-12 flex-shrink-0
                            bg-[#F5C542] border-[3px] border-[#2C2416]
                            flex items-center justify-center
                        ">
                            <MessageCircle className="w-6 h-6 text-[#2C2416]" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-[#2C2416] mb-2">
                                Ready to Start Your Project?
                            </h2>
                            <p className="text-[#5A5247] font-medium leading-relaxed">
                                We typically respond within <strong className="text-[#2C2416]">2-4 hours</strong> during business hours. 
                                Choose any platform below that works best for you — we&apos;re active on all of them!
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Social Contact Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                >
                    {socialLinks.map((contact) => {
                        const IconComponent = iconComponents[contact.id];
                        return (
                            <motion.a
                                key={contact.id}
                                variants={item}
                                href={contact.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    group p-5 md:p-6
                                    ${contact.color} ${contact.hoverColor}
                                    border-[4px] border-[#2C2416]
                                    shadow-[6px_6px_0_0_#2C2416]
                                    hover:shadow-[4px_4px_0_0_#2C2416]
                                    hover:translate-x-[2px] hover:translate-y-[2px]
                                    active:shadow-[2px_2px_0_0_#2C2416]
                                    active:translate-x-[4px] active:translate-y-[4px]
                                    transition-all duration-150
                                    flex items-center gap-4
                                `}
                            >
                                <div className={`
                                    w-14 h-14 flex-shrink-0
                                    bg-white/20 backdrop-blur-sm
                                    border-[3px] border-white/30
                                    flex items-center justify-center
                                    ${contact.textColor}
                                `}>
                                    {IconComponent && <IconComponent />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-lg md:text-xl font-black ${contact.textColor}`}>
                                            {contact.name}
                                        </h3>
                                        <ExternalLink className={`w-4 h-4 ${contact.textColor} opacity-60`} />
                                    </div>
                                    <p className={`${contact.textColor} opacity-80 font-medium text-sm`}>
                                        {contact.description}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </motion.div>

                {/* Email Section */}
                {contactInfo.email && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10"
                    >
                        <div className="
                            p-6 md:p-8
                            bg-[#2C2416]
                            border-[4px] border-[#F5C542]
                            shadow-[6px_6px_0_0_#F5C542]
                        ">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="
                                        w-12 h-12 flex-shrink-0
                                        bg-[#F5C542] border-[3px] border-[#F5F1E8]
                                        flex items-center justify-center
                                    ">
                                        <Mail className="w-6 h-6 text-[#2C2416]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#F5F1E8]">
                                            Prefer Email?
                                        </h3>
                                        <p className="text-[#A8A499] font-medium text-sm">
                                            For detailed project discussions
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="
                                        px-6 py-3
                                        bg-[#F5C542] text-[#2C2416]
                                        border-[3px] border-[#F5F1E8]
                                        shadow-[3px_3px_0_0_#F5F1E8]
                                        hover:shadow-[2px_2px_0_0_#F5F1E8]
                                        hover:translate-x-[1px] hover:translate-y-[1px]
                                        font-black text-sm uppercase tracking-wider
                                        transition-all duration-150
                                        flex items-center gap-2
                                    "
                                >
                                    <span>{contactInfo.email}</span>
                                    <Send className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Response Time Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-[#7A7568] font-medium text-sm mt-8"
                >
                    💡 Tip: For fastest response, use <strong>WhatsApp</strong> or <strong>Telegram</strong>
                </motion.p>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
                <div className="text-[#2C2416] font-bold">Loading...</div>
            </div>
        }>
            <ContactPageContent />
        </Suspense>
    );
}
