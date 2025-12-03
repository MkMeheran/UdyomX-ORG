// Quick test script for API endpoints
const testAPIs = async () => {
    console.log('=== Testing APIs ===\n');
    
    try {
        // Test Blogs API
        console.log('📝 Testing /api/blogs...');
        const blogsRes = await fetch('http://localhost:3000/api/blogs');
        const blogs = await blogsRes.json();
        console.log(`✅ Blogs: ${blogs.length || 0} posts`);
        if (Array.isArray(blogs)) {
            blogs.forEach(b => console.log(`   - ${b.slug}`));
        }
    } catch (e) {
        console.log('❌ Blogs Error:', e.message);
    }
    
    console.log('');
    
    try {
        // Test Projects API
        console.log('📂 Testing /api/projects...');
        const projectsRes = await fetch('http://localhost:3000/api/projects');
        const projects = await projectsRes.json();
        console.log(`✅ Projects: ${projects.length || 0} projects`);
        if (Array.isArray(projects)) {
            projects.forEach(p => console.log(`   - ${p.slug}`));
        }
    } catch (e) {
        console.log('❌ Projects Error:', e.message);
    }
    
    console.log('');
    
    try {
        // Test Services API
        console.log('🛠️ Testing /api/services...');
        const servicesRes = await fetch('http://localhost:3000/api/services');
        const services = await servicesRes.json();
        console.log(`✅ Services: ${services.length || 0} services`);
        if (Array.isArray(services)) {
            services.forEach(s => console.log(`   - ${s.slug}: ${s.title}`));
        }
    } catch (e) {
        console.log('❌ Services Error:', e.message);
    }
    
    console.log('\n=== Test Complete ===');
};

testAPIs();
