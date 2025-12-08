// Test script to create Post, Project, and Service via API
// Run: node test-admin-api.mjs

const BASE_URL = 'https://udyomxorg.vercel.app';

async function testAPIs() {
    console.log('🚀 Starting Admin API Tests...\n');

    // ==========================================
    // TEST 1: Create Blog Post
    // ==========================================
    console.log('📝 TEST 1: Creating Blog Post...');
    
    const blogData = {
        title: 'Complete Guide to Next.js 14 App Router',
        slug: 'complete-guide-nextjs-14-app-router',
        excerpt: 'Learn everything about Next.js 14 App Router, Server Components, and modern React patterns.',
        category: 'Technology',
        tags: ['nextjs', 'react', 'typescript', 'web-development'],
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
        status: 'published',
        author: 'Mokammel Morshed',
        authorAvatar: 'https://avatars.githubusercontent.com/u/12345678',
        readTime: 12,
        layout: 'standard',
        isPremium: false,
        // Content sections
        contents: [
            { 
                type: 'text', 
                content: '# Introduction\n\nNext.js 14 introduces the App Router, a new paradigm for building React applications.\n\n## What You Will Learn\n\n- Server Components\n- Client Components\n- Data Fetching\n- Routing', 
                orderIndex: 0 
            }
        ],
        // Gallery images
        gallery: [
            { 
                type: 'image', 
                url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 
                altText: 'Code editor showing Next.js code',
                caption: 'Modern development with Next.js',
                orderIndex: 0 
            },
            { 
                type: 'image', 
                url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', 
                altText: 'Programming workspace',
                caption: 'Clean coding environment',
                orderIndex: 1 
            }
        ],
        // Downloadable files
        downloads: [
            { 
                title: 'Next.js 14 Cheatsheet', 
                url: 'https://example.com/nextjs-cheatsheet.pdf', 
                fileType: 'PDF', 
                fileSize: '2.5 MB', 
                orderIndex: 0 
            },
            { 
                title: 'Source Code Bundle', 
                url: 'https://example.com/source-code.zip', 
                fileType: 'ZIP', 
                fileSize: '15 MB', 
                orderIndex: 1 
            }
        ],
        // FAQs
        faqs: [
            { 
                question: 'What is the App Router in Next.js 14?', 
                answer: 'The App Router is a new file-system based router that supports React Server Components, nested layouts, and more.',
                orderIndex: 0 
            },
            { 
                question: 'Should I migrate from Pages Router?', 
                answer: 'It depends on your project. The App Router offers many benefits but the Pages Router is still fully supported.',
                orderIndex: 1 
            }
        ],
        // SEO
        seo: {
            title: 'Complete Guide to Next.js 14 App Router | UdyomX',
            description: 'Master Next.js 14 App Router with our comprehensive tutorial covering Server Components, routing, and best practices.',
            keywords: ['nextjs 14', 'app router', 'react', 'server components', 'tutorial']
        },
        // Recommended posts (by slug)
        recommended: ['react-best-practices', 'typescript-tips']
    };

    try {
        const blogRes = await fetch(`${BASE_URL}/api/blogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData)
        });
        const blogResult = await blogRes.json();
        console.log('   Status:', blogRes.status);
        console.log('   Result:', JSON.stringify(blogResult, null, 2).substring(0, 500));
        console.log(blogRes.ok ? '   ✅ Blog Post Created!\n' : '   ❌ Blog Post Failed!\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }

    // ==========================================
    // TEST 2: Create Project
    // ==========================================
    console.log('🏗️ TEST 2: Creating Project...');
    
    const projectData = {
        name: 'E-Commerce Platform',
        slug: 'ecommerce-platform-nextjs',
        description: 'A full-featured e-commerce platform built with Next.js, Stripe, and Supabase.',
        longDescription: '## Project Overview\n\nThis e-commerce platform provides everything you need to run an online store.\n\n### Features\n\n- Product catalog with search\n- Shopping cart\n- Secure Stripe checkout\n- Order management\n- Admin dashboard',
        category: 'Web Development',
        tags: ['nextjs', 'ecommerce', 'stripe', 'supabase', 'tailwind'],
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
        status: 'published',
        featured: true,
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        projectUrl: 'https://demo-ecommerce.vercel.app',
        githubUrl: 'https://github.com/udyomx/ecommerce-platform',
        techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Stripe', 'Vercel'],
        // Gallery
        gallery: [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                altText: 'Admin Dashboard',
                caption: 'Powerful admin dashboard',
                orderIndex: 0
            },
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
                altText: 'Product Page',
                caption: 'Beautiful product pages',
                orderIndex: 1
            }
        ],
        // Downloads
        downloads: [
            {
                title: 'Project Documentation',
                url: 'https://example.com/docs.pdf',
                fileType: 'PDF',
                fileSize: '5 MB',
                orderIndex: 0
            }
        ],
        // FAQs
        faqs: [
            {
                question: 'Is this project open source?',
                answer: 'Yes, the entire codebase is available on GitHub under MIT license.',
                orderIndex: 0
            }
        ]
    };

    try {
        const projectRes = await fetch(`${BASE_URL}/api/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        const projectResult = await projectRes.json();
        console.log('   Status:', projectRes.status);
        console.log('   Result:', JSON.stringify(projectResult, null, 2).substring(0, 500));
        console.log(projectRes.ok ? '   ✅ Project Created!\n' : '   ❌ Project Failed!\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }

    // ==========================================
    // TEST 3: Create Service
    // ==========================================
    console.log('🛠️ TEST 3: Creating Service...');
    
    const serviceData = {
        title: 'Custom Web Application Development',
        slug: 'custom-web-application-development',
        hookLine: 'Transform your business ideas into powerful web applications',
        description: 'We build custom web applications tailored to your specific business needs using modern technologies.',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        status: 'published',
        contentFormat: 'mdx',
        showGallery: true,
        showDownloads: true,
        // Features
        features: [
            {
                title: 'Modern Tech Stack',
                description: 'Built with Next.js, React, TypeScript, and Tailwind CSS',
                icon: 'code',
                orderIndex: 0
            },
            {
                title: 'Responsive Design',
                description: 'Works perfectly on all devices - desktop, tablet, and mobile',
                icon: 'smartphone',
                orderIndex: 1
            },
            {
                title: 'Fast Performance',
                description: 'Optimized for speed with server-side rendering and caching',
                icon: 'zap',
                orderIndex: 2
            }
        ],
        // Pricing Packages
        packages: [
            {
                name: 'Starter',
                price: 999,
                currency: 'USD',
                period: 'one-time',
                description: 'Perfect for small projects',
                features: ['Up to 5 pages', 'Basic SEO', 'Contact form', '1 month support'],
                isPopular: false,
                orderIndex: 0
            },
            {
                name: 'Professional',
                price: 2499,
                currency: 'USD',
                period: 'one-time',
                description: 'Best for growing businesses',
                features: ['Up to 15 pages', 'Advanced SEO', 'CMS integration', 'E-commerce ready', '3 months support'],
                isPopular: true,
                orderIndex: 1
            },
            {
                name: 'Enterprise',
                price: 4999,
                currency: 'USD',
                period: 'one-time',
                description: 'For large scale applications',
                features: ['Unlimited pages', 'Full SEO suite', 'Custom integrations', 'Priority support', '1 year maintenance'],
                isPopular: false,
                orderIndex: 2
            }
        ],
        // Problems we solve
        problems: [
            { text: 'Outdated website that doesn\'t convert visitors', orderIndex: 0 },
            { text: 'Slow loading times affecting user experience', orderIndex: 1 },
            { text: 'Not mobile-friendly in a mobile-first world', orderIndex: 2 }
        ],
        // Solutions we offer
        solutions: [
            { text: 'Modern, conversion-optimized design', orderIndex: 0 },
            { text: 'Lightning-fast performance with Next.js', orderIndex: 1 },
            { text: 'Fully responsive across all devices', orderIndex: 2 }
        ],
        // Testimonials
        testimonials: [
            {
                name: 'John Smith',
                role: 'CEO',
                company: 'TechStartup Inc',
                content: 'UdyomX delivered an amazing web application that exceeded our expectations. Highly recommended!',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                rating: 5,
                orderIndex: 0
            },
            {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                company: 'GrowthCo',
                content: 'The team was professional and delivered on time. Our conversion rate increased by 40%!',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                rating: 5,
                orderIndex: 1
            }
        ],
        // Gallery
        gallery: [
            {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                altText: 'Web development',
                caption: 'Clean code architecture',
                orderIndex: 0
            }
        ],
        // Downloads
        downloads: [
            {
                title: 'Service Brochure',
                url: 'https://example.com/brochure.pdf',
                fileType: 'PDF',
                fileSize: '3 MB',
                orderIndex: 0
            }
        ],
        // FAQs
        faqs: [
            {
                question: 'How long does it take to build a web application?',
                answer: 'Typically 4-12 weeks depending on complexity and features required.',
                orderIndex: 0
            },
            {
                question: 'Do you provide ongoing maintenance?',
                answer: 'Yes, we offer maintenance packages to keep your application updated and secure.',
                orderIndex: 1
            }
        ],
        // SEO
        seo: {
            title: 'Custom Web Application Development Services | UdyomX',
            description: 'Professional web application development services using Next.js, React, and modern technologies.',
            keywords: ['web development', 'nextjs', 'react', 'custom application']
        }
    };

    try {
        const serviceRes = await fetch(`${BASE_URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        });
        const serviceResult = await serviceRes.json();
        console.log('   Status:', serviceRes.status);
        console.log('   Result:', JSON.stringify(serviceResult, null, 2).substring(0, 500));
        console.log(serviceRes.ok ? '   ✅ Service Created!\n' : '   ❌ Service Failed!\n');
    } catch (error) {
        console.log('   ❌ Error:', error.message, '\n');
    }

    // ==========================================
    // Verify Data
    // ==========================================
    console.log('🔍 Verifying created data...\n');

    try {
        const blogs = await fetch(`${BASE_URL}/api/blogs`).then(r => r.json());
        console.log('   📝 Blogs:', blogs.length, 'found');
        
        const projects = await fetch(`${BASE_URL}/api/projects`).then(r => r.json());
        console.log('   🏗️ Projects:', projects.length, 'found');
        
        const services = await fetch(`${BASE_URL}/api/services`).then(r => r.json());
        console.log('   🛠️ Services:', services.length, 'found');
    } catch (error) {
        console.log('   ❌ Verification Error:', error.message);
    }

    console.log('\n✅ Admin API Tests Complete!');
}

testAPIs();
