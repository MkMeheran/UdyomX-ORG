// Test Services API
const BASE_URL = 'http://localhost:3000';

async function testServices() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('         TESTING SERVICES API (Supabase)');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test 1: GET all published services
    console.log('📋 TEST 1: GET /api/services (Published services)');
    console.log('─'.repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/api/services`);
        const services = await res.json();
        console.log(`✅ Status: ${res.status}`);
        console.log(`✅ Found ${services.length} published services`);
        if (services.length > 0) {
            console.log('📌 First service:', JSON.stringify(services[0], null, 2).slice(0, 500));
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 2: GET all services (admin - includes drafts)
    console.log('\n📋 TEST 2: GET /api/services?status=all (Admin - All services)');
    console.log('─'.repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/api/services?status=all`);
        const services = await res.json();
        console.log(`✅ Status: ${res.status}`);
        console.log(`✅ Found ${services.length} total services (all statuses)`);
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 3: POST - Create a new service
    console.log('\n📋 TEST 3: POST /api/services (Create new service)');
    console.log('─'.repeat(50));
    const newService = {
        slug: 'ai-automation-service',
        title: 'AI Automation Service',
        hookLine: 'Transform your business with intelligent automation',
        description: '## What We Offer\n\nWe help businesses automate their workflows using AI and modern tools like n8n, OpenAI, and Supabase.\n\n### Key Benefits\n- Save 10+ hours per week\n- Reduce human errors\n- Scale your operations',
        contentFormat: 'mdx',
        category: 'Automation',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        status: 'published',
        showGallery: true,
        showDownloads: true,
        publishDate: new Date().toISOString(),
        // SEO Fields
        seoTitle: 'AI Automation Service | UdyomX',
        seoDescription: 'Professional AI automation services to transform your business workflows',
        seoKeywords: ['AI', 'automation', 'n8n', 'workflow', 'business'],
        shortSummary: 'AI-powered workflow automation for modern businesses',
        longSummary: 'We provide end-to-end AI automation solutions using cutting-edge tools to streamline your business processes.',
        painPoints: ['Manual repetitive tasks', 'Data entry errors', 'Slow processes', 'High operational costs'],
        solutionsOffered: ['Automated workflows', 'AI-powered data processing', 'Custom integrations', '24/7 automated operations'],
        keyBenefits: ['Save 10+ hours weekly', 'Reduce errors by 95%', 'Scale without hiring', 'ROI within 30 days'],
        pricing: 'Starting from $500/month',
        useCases: ['Lead generation automation', 'Email marketing automation', 'Data synchronization', 'Report generation'],
        targetAudience: 'Small to medium businesses looking to scale operations',
        toolsUsed: ['n8n', 'OpenAI', 'Supabase', 'Make.com', 'Zapier'],
        // Contact (custom for this service)
        contactWhatsApp: '+8801234567890',
        contactTelegram: '@udyomx_ai',
        contactEmail: 'ai@udyomx.com',
        // Relations
        features: [
            { icon: 'Zap', title: 'Lightning Fast', description: 'Automate tasks in minutes, not hours' },
            { icon: 'Shield', title: 'Secure & Reliable', description: 'Enterprise-grade security for your data' },
            { icon: 'TrendingUp', title: 'Scalable', description: 'Grows with your business needs' }
        ],
        packages: [
            { 
                title: 'Starter', 
                price: 500, 
                features: ['5 automated workflows', 'Email support', 'Basic integrations'], 
                deliveryTime: '1 week', 
                revisions: 2, 
                isPopular: false 
            },
            { 
                title: 'Professional', 
                price: 1200, 
                discountPrice: 999,
                features: ['15 automated workflows', 'Priority support', 'Advanced integrations', 'Custom dashboard'], 
                deliveryTime: '2 weeks', 
                revisions: 5, 
                isPopular: true 
            },
            { 
                title: 'Enterprise', 
                price: 3000, 
                features: ['Unlimited workflows', '24/7 support', 'All integrations', 'Dedicated manager', 'Custom development'], 
                deliveryTime: '4 weeks', 
                revisions: -1, 
                isPopular: false 
            }
        ],
        problems: [
            { text: 'Spending hours on repetitive manual tasks?' },
            { text: 'Making costly data entry mistakes?' },
            { text: 'Struggling to scale without hiring more staff?' }
        ],
        solutions: [
            { text: 'Automate repetitive tasks with AI-powered workflows' },
            { text: 'Eliminate human errors with intelligent data processing' },
            { text: 'Scale operations infinitely without additional headcount' }
        ],
        testimonials: [
            { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=john', rating: 5, quote: 'Saved us 20 hours per week! Absolutely transformative.' },
            { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 5, quote: 'Best investment we made this year. ROI within 2 weeks.' }
        ],
        faqs: [
            { question: 'How long does setup take?', answer: 'Most basic automations are set up within 1-2 days. Complex workflows may take 1-2 weeks.' },
            { question: 'Do I need technical knowledge?', answer: 'No! We handle all the technical setup. You just need to tell us what you want automated.' },
            { question: 'What if I need changes later?', answer: 'All packages include revisions. We also offer ongoing support and maintenance plans.' }
        ]
    };

    try {
        const res = await fetch(`${BASE_URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newService)
        });
        const result = await res.json();
        console.log(`✅ Status: ${res.status}`);
        if (res.ok) {
            console.log(`✅ Created service with ID: ${result.id}`);
            console.log(`✅ Slug: ${result.slug}`);
        } else {
            console.log('❌ Error:', result.error);
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 4: GET single service by slug
    console.log('\n📋 TEST 4: GET /api/services/ai-automation-service (Single service)');
    console.log('─'.repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/api/services/ai-automation-service`);
        const service = await res.json();
        console.log(`✅ Status: ${res.status}`);
        if (res.ok) {
            console.log(`✅ Title: ${service.title}`);
            console.log(`✅ Category: ${service.category}`);
            console.log(`✅ Features: ${service.features?.length || 0}`);
            console.log(`✅ Packages: ${service.packages?.length || 0}`);
            console.log(`✅ Testimonials: ${service.testimonials?.length || 0}`);
            console.log(`✅ FAQs: ${service.faqs?.length || 0}`);
        } else {
            console.log('❌ Error:', service.error);
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 5: GET services with relations
    console.log('\n📋 TEST 5: GET /api/services?relations=true (With all relations)');
    console.log('─'.repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/api/services?relations=true`);
        const services = await res.json();
        console.log(`✅ Status: ${res.status}`);
        console.log(`✅ Found ${services.length} services with relations`);
        if (services.length > 0 && services[0].features) {
            console.log(`✅ First service has ${services[0].features.length} features`);
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 6: View public services page
    console.log('\n📋 TEST 6: GET /services (Public page)');
    console.log('─'.repeat(50));
    try {
        const res = await fetch(`${BASE_URL}/services`);
        console.log(`✅ Status: ${res.status}`);
        console.log(`✅ Public services page accessible`);
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Test 7: Create second service (Web Development)
    console.log('\n📋 TEST 7: POST /api/services (Create Web Development service)');
    console.log('─'.repeat(50));
    const webService = {
        slug: 'web-development-service',
        title: 'Professional Web Development',
        hookLine: 'Modern, fast, and beautiful websites that convert',
        description: '## Custom Web Development\n\nWe build modern web applications using Next.js, React, and cutting-edge technologies.',
        contentFormat: 'mdx',
        category: 'Development',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'published',
        showGallery: true,
        showDownloads: false,
        publishDate: new Date().toISOString(),
        seoTitle: 'Web Development Service | UdyomX',
        seoDescription: 'Professional web development services using Next.js and React',
        seoKeywords: ['web development', 'Next.js', 'React', 'website'],
        shortSummary: 'Custom web development for modern businesses',
        pricing: 'Starting from $1000',
        targetAudience: 'Businesses needing modern web presence',
        toolsUsed: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        features: [
            { icon: 'Code', title: 'Clean Code', description: 'Maintainable and scalable codebase' },
            { icon: 'Smartphone', title: 'Responsive', description: 'Perfect on all devices' },
            { icon: 'Zap', title: 'Fast Performance', description: 'Optimized for speed' }
        ],
        packages: [
            { title: 'Landing Page', price: 1000, features: ['Single page', 'Mobile responsive', 'Contact form'], deliveryTime: '1 week', revisions: 3, isPopular: false },
            { title: 'Business Website', price: 2500, features: ['5-10 pages', 'CMS integration', 'SEO optimized'], deliveryTime: '2 weeks', revisions: 5, isPopular: true },
            { title: 'Web Application', price: 5000, features: ['Custom functionality', 'User authentication', 'Database integration'], deliveryTime: '4 weeks', revisions: -1, isPopular: false }
        ],
        testimonials: [
            { name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?u=mike', rating: 5, quote: 'Our new website increased conversions by 150%!' }
        ],
        faqs: [
            { question: 'What technologies do you use?', answer: 'We primarily use Next.js, React, TypeScript, and Tailwind CSS for modern, performant websites.' },
            { question: 'Do you provide hosting?', answer: 'Yes! We can deploy and host your website on Vercel, AWS, or your preferred platform.' }
        ]
    };

    try {
        const res = await fetch(`${BASE_URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webService)
        });
        const result = await res.json();
        console.log(`✅ Status: ${res.status}`);
        if (res.ok) {
            console.log(`✅ Created service: ${result.slug}`);
        } else {
            console.log('❌ Error:', result.error);
        }
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    // Final: List all services
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('         FINAL: ALL SERVICES IN DATABASE');
    console.log('═══════════════════════════════════════════════════════════');
    try {
        const res = await fetch(`${BASE_URL}/api/services?status=all&relations=true`);
        const services = await res.json();
        console.log(`\n📊 Total Services: ${services.length}\n`);
        services.forEach((s, i) => {
            console.log(`${i+1}. ${s.title}`);
            console.log(`   Slug: ${s.slug}`);
            console.log(`   Status: ${s.status}`);
            console.log(`   Category: ${s.category}`);
            console.log(`   Features: ${s.features?.length || 0} | Packages: ${s.packages?.length || 0}`);
            console.log('');
        });
    } catch (e) {
        console.log('❌ Error:', e.message);
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('         TEST COMPLETE!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🔗 View Services: http://localhost:3000/services');
    console.log('🔗 Admin Panel: http://localhost:3000/dashboard/admin/services');
}

testServices().catch(console.error);
