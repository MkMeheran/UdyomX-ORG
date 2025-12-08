#!/usr/bin/env node
/**
 * Test Viewer Fetch Flow
 * Verifies frontend correctly displays gallery and downloads
 */

const testSlug = 'test-upload-1765196729954'; // From admin test
const baseUrl = 'http://localhost:3000';

async function testViewerFetch() {
  console.log('🔍 Testing viewer fetch flow...\n');

  try {
    // 1. Fetch blog post page
    console.log(`📄 Fetching: ${baseUrl}/blog/${testSlug}`);
    const response = await fetch(`${baseUrl}/blog/${testSlug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`✅ Page fetched (${(html.length / 1024).toFixed(2)} KB)\n`);

    // 2. Check for gallery section
    console.log('🖼️  Checking for Gallery section...');
    const hasGallerySection = html.includes('Gallery') || html.includes('gallery');
    const hasGalleryImages = html.includes('picsum.photos');
    
    if (hasGallerySection && hasGalleryImages) {
      console.log('✅ Gallery section found with images');
    } else if (hasGallerySection) {
      console.log('⚠️  Gallery section found but no images detected');
    } else {
      console.log('❌ Gallery section NOT found');
    }

    // 3. Check for downloads section
    console.log('\n📥 Checking for Downloads section...');
    const hasDownloadSection = html.includes('Download') || html.includes('download');
    const hasPdfLink = html.includes('dummy.pdf');
    
    if (hasDownloadSection && hasPdfLink) {
      console.log('✅ Downloads section found with files');
    } else if (hasDownloadSection) {
      console.log('⚠️  Downloads section found but no files detected');
    } else {
      console.log('❌ Downloads section NOT found');
    }

    // 4. Check for content
    console.log('\n📝 Checking for content...');
    const hasTestContent = html.includes('Test Post') || html.includes('Gallery Section') || html.includes('Downloads Section');
    
    if (hasTestContent) {
      console.log('✅ Post content found');
    } else {
      console.log('❌ Post content NOT found');
    }

    // 5. Check for title
    console.log('\n🏷️  Checking for title...');
    const hasTitle = html.includes('Test Blog Post with Gallery &amp; Downloads') || 
                     html.includes('Test Blog Post with Gallery & Downloads');
    
    if (hasTitle) {
      console.log('✅ Post title found');
    } else {
      console.log('❌ Post title NOT found');
    }

    console.log('\n' + '='.repeat(60));
    
    if (hasGalleryImages && hasPdfLink && hasTestContent && hasTitle) {
      console.log('✅ VIEWER FETCH TEST PASSED!');
      console.log('='.repeat(60));
      console.log('\n🎉 All components rendering correctly on frontend!\n');
      return { success: true };
    } else {
      console.log('⚠️  PARTIAL SUCCESS');
      console.log('='.repeat(60));
      console.log('\nSome components may be missing. Check browser:\n');
      console.log(`   ${baseUrl}/blog/${testSlug}\n`);
      return { success: false, partial: true };
    }

  } catch (error) {
    console.error('\n❌ VIEWER FETCH TEST FAILED!');
    console.error('Error:', error.message);
    return { success: false, error };
  }
}

// Run test
(async () => {
  await testViewerFetch();
})();
