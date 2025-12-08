/**
 * Site Configuration
 * 
 * This file contains all editable information for the UdyomX ORG website.
 * Update these values to change site-wide information without modifying component code.
 */

export const siteConfig = {
  // Organization Information
  name: "UdyomX ORG",
  shortName: "UdyomX",
  tagline: "A Digital Solutions Organization",
  description: "We turn ideas into reality with cutting-edge web development, design, and digital services. Our team creates exceptional solutions that help businesses thrive in the digital age.",
  
  // Founder Information
  founder: {
    name: "Mokammel Morshed",
    email: "mdmokammelmorshed@gmail.com",
  },

  // Contact Information
  contact: {
    email: "mdmokammelmorshed@gmail.com",
    phone: "+880 1884655417", // Update with real phone number
    location: "Khulna, Bangladesh",
  },

  // URLs & Links
  urls: {
    website: "https://udyomxorg.vercel.app/",
    github: "https://github.com/MkMeheran",
    twitter: "https://twitter.com/Meheran_3005", // Update with real Twitter handle
    linkedin: "https://www.linkedin.com/in/mokammel-morshed", // Update with real LinkedIn
    portfolio: "https://meheran-portfolio.vercel.app/", // Update with real portfolio URL
  },

  // Services
  services: [
    "Web Development",
    "UI/UX Design",
    "n8n AI Automation",
    "Custom Solutions",
  ],

  // SEO Configuration
  seo: {
    title: "UdyomX ORG - Affordable Website Development & Digital Solutions in Bangladesh",
    description: "UdyomX ORG provides affordable static and semi-dynamic website development, digital solutions, UI/UX, and full-stack development services. Perfect for small businesses and individuals looking for budget-friendly websites in Bangladesh.",
    keywords: [
      "full-stack development",
      "web development",
      "digital solutions",
      "UI/UX design",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "software development",
      "consulting",
      "custom solutions",
      "Bangladesh",
      "UdyomX",
      "Mokammel Morshed",
      // Local SEO keywords for client hunting
      "affordable website development",
      "budget friendly website",
      "cheap website design Bangladesh",
      "static website design BD",
      "semi dynamic website BD",
      "portfolio website developer Bangladesh",
      "landing page design Bangladesh",
      "small business website BD",
      "freelance web developer BD",
      "business website Bangladesh",
      "UdyomX web services",
    ],
    
    // Canonical URL
    canonical: "https://udyomxorg.vercel.app",
    
    // Author & Publisher
    author: "Mokammel Morshed",
    publisher: "UdyomX ORG",
    
    // Robots settings
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        maxImagePreview: "large",
        maxSnippet: -1,
      },
    },
    
    // Open Graph
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://udyomxorg.vercel.app",
      siteName: "UdyomX ORG",
      title: "UdyomX ORG - Affordable Website Development in Bangladesh",
      description: "Professional and affordable website development services for small businesses and individuals in Bangladesh.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "UdyomX ORG - Digital Solutions",
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: "@Meheran_3005",
      creator: "@Meheran_3005",
      title: "UdyomX ORG - Affordable Website Development in Bangladesh",
      description: "Professional and affordable website development services for small businesses.",
      images: ["/og-image.jpg"],
    },
    
    ogImage: "/og-image.jpg",
    twitterHandle: "@Meheran_3005",
    
    // FAQ Schema for better SEO
    faq: [
      {
        question: "How much does a static website cost in Bangladesh?",
        answer: "UdyomX offers static websites starting from $10 to $100 depending on pages and design complexity."
      },
      {
        question: "Do you offer website maintenance?",
        answer: "Yes, UdyomX provides maintenance packages for all static and semi-dynamic websites."
      },
      {
        question: "What is the difference between static and semi-dynamic websites?",
        answer: "Static websites have fixed content, while semi-dynamic websites can have interactive elements and content management systems."
      },
      {
        question: "How long does it take to build a website?",
        answer: "Typically 1-4 weeks depending on complexity. Simple static websites can be delivered in 3-7 days."
      },
    ],
    
    // Organization Schema
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "UdyomX ORG",
      url: "https://udyomxorg.vercel.app",
      logo: "https://udyomxorg.vercel.app/logo.png",
      description: "Professional website development and digital solutions provider in Bangladesh",
      founder: {
        "@type": "Person",
        name: "Mokammel Morshed",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Khulna",
        addressCountry: "BD",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+880-1884655417",
        contactType: "Customer Service",
        email: "mdmokammelmorshed@gmail.com",
      },
      sameAs: [
        "https://github.com/MkMeheran",
        "https://twitter.com/Meheran_3005",
        "https://www.linkedin.com/in/mokammel-morshed",
        "https://meheran-portfolio.vercel.app",
      ],
    },
  },

  // Legal
  legal: {
    privacyPolicyUrl: "/privacy-policy",
    termsOfServiceUrl: "/terms-of-service",
  },

  // Branding Colors (for reference)
  colors: {
    primary: "#2196F3",
    secondary: "#F5C542",
    accent: "#FF6B6B",
    success: "#5CB85C",
    dark: "#2C2416",
    light: "#F5F5F0",
  },
} as const;

// Type exports for TypeScript
export type SiteConfig = typeof siteConfig;
