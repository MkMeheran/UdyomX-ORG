#!/usr/bin/env node
/**
 * Test Admin Upload Flow
 * Tests creating a blog post with gallery and downloads via Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testPostId = randomUUID();
const testSlug = `test-upload-${Date.now()}`;

const testPost = {
  id: testPostId,
  slug: testSlug,
  title: 'Test Blog Post with Gallery & Downloads',
  excerpt: 'Testing Supabase storage integration for media uploads',
  category: 'Tutorial',
  author: 'Test Admin',
  status: 'published',
  publish_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
};

const testContent = `# Test Post

This is a test post to verify:
- Gallery items save correctly
- Download items save correctly
- Data fetches properly on frontend

## Gallery Section

The gallery should display uploaded images.

## Downloads Section

Download files should be accessible.`;

const testGallery = [
  {
    parent_id: testPostId,
    parent_type: 'post',
    url: 'https://picsum.photos/800/600?random=1',
    type: 'image',
    alt: 'Test Gallery Image 1',
    caption: 'First test image',
    sort_order: 0,
  },
  {
    parent_id: testPostId,
    parent_type: 'post',
    url: 'https://picsum.photos/800/600?random=2',
    type: 'image',
    alt: 'Test Gallery Image 2',
    caption: 'Second test image',
    sort_order: 1,
  },
];

const testDownloads = [
  {
    parent_id: testPostId,
    parent_type: 'post',
    title: 'Sample PDF Document',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_type: 'pdf',
    file_size: '13 KB',
    is_premium: false,
    sort_order: 0,
  },
  {
    parent_id: testPostId,
    parent_type: 'post',
    title: 'Test Image Download',
    url: 'https://picsum.photos/1920/1080?random=3',
    file_type: 'jpg',
    file_size: '245 KB',
    is_premium: false,
    sort_order: 1,
  },
];

async function testAdminUpload() {
  console.log('🚀 Starting admin upload test...\n');

  try {
    // 1. Create post
    console.log('📝 Creating post...');
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert(testPost)
      .select()
      .single();

    if (postError) throw postError;
    console.log('✅ Post created:', post.slug);

    // 2. Add content
    console.log('\n📄 Adding content...');
    const { error: contentError } = await supabase
      .from('contents')
      .insert({
        parent_id: testPostId,
        parent_type: 'post',
        content: testContent,
        content_format: 'markdown',
      });

    if (contentError) throw contentError;
    console.log('✅ Content added');

    // 3. Add gallery items
    console.log('\n🖼️  Adding gallery items...');
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery')
      .insert(testGallery)
      .select();

    if (galleryError) throw galleryError;
    console.log(`✅ ${gallery.length} gallery items added`);

    // 4. Add downloads
    console.log('\n📥 Adding download items...');
    const { data: downloads, error: downloadsError } = await supabase
      .from('downloads')
      .insert(testDownloads)
      .select();

    if (downloadsError) throw downloadsError;
    console.log(`✅ ${downloads.length} download items added`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ ADMIN UPLOAD TEST PASSED!');
    console.log('='.repeat(60));
    console.log(`\n📍 View post at: http://localhost:3000/blog/${post.slug}`);
    console.log(`📍 Post ID: ${testPostId}`);
    console.log(`📍 Post Slug: ${post.slug}\n`);

    return { success: true, slug: post.slug, id: testPostId };
  } catch (error) {
    console.error('\n❌ ADMIN UPLOAD TEST FAILED!');
    console.error('Error:', error.message);
    console.error('Details:', error);
    return { success: false, error };
  }
}

async function verifyFetch(slug, postId) {
  console.log('\n🔍 Verifying data fetch...\n');

  try {
    // Fetch post with all relations
    console.log('📖 Fetching post...');
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (postError) throw postError;
    console.log('✅ Post fetched:', post.title);

    // Fetch content
    console.log('\n📄 Fetching content...');
    const { data: content, error: contentError } = await supabase
      .from('contents')
      .select('*')
      .eq('parent_id', postId)
      .eq('parent_type', 'post')
      .single();

    if (contentError) throw contentError;
    console.log('✅ Content fetched:', content.content.substring(0, 50) + '...');

    // Fetch gallery
    console.log('\n🖼️  Fetching gallery...');
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery')
      .select('*')
      .eq('parent_id', postId)
      .eq('parent_type', 'post')
      .order('sort_order', { ascending: true });

    if (galleryError) throw galleryError;
    console.log(`✅ Gallery fetched: ${gallery.length} items`);
    gallery.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.alt} (${item.type})`);
    });

    // Fetch downloads
    console.log('\n📥 Fetching downloads...');
    const { data: downloads, error: downloadsError } = await supabase
      .from('downloads')
      .select('*')
      .eq('parent_id', postId)
      .eq('parent_type', 'post')
      .order('sort_order', { ascending: true });

    if (downloadsError) throw downloadsError;
    console.log(`✅ Downloads fetched: ${downloads.length} items`);
    downloads.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.title} (${item.file_type})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ FETCH VERIFICATION PASSED!');
    console.log('='.repeat(60));
    console.log('\nAll data saved and retrieved correctly! 🎉\n');

    return { success: true };
  } catch (error) {
    console.error('\n❌ FETCH VERIFICATION FAILED!');
    console.error('Error:', error.message);
    console.error('Details:', error);
    return { success: false, error };
  }
}

// Run tests
(async () => {
  const uploadResult = await testAdminUpload();
  
  if (uploadResult.success) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
    await verifyFetch(uploadResult.slug, uploadResult.id);
  }
})();
