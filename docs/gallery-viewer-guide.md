# 🖼️ Gallery Viewer Guide - HTML Content এ Image/Video Lightbox

## ⚡ Quick Reference:

```html
<!-- Image Lightbox -->
<img src="photo.jpg" alt="My Photo" class="lightbox-trigger" />

<!-- MP4 Video Lightbox -->
<video src="video.mp4" class="lightbox-trigger" controls></video>

<!-- YouTube Video Lightbox -->
<img 
  src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" 
  alt="Tutorial" 
  class="lightbox-trigger"
  data-youtube="VIDEO_ID" 
/>
```

---

## ✅ কিভাবে কাজ করে:

আপনার HTML content এ যেকোনো image বা video তে `lightbox-trigger` class add করলে সেটা click করার পর full-screen gallery viewer এ open হবে।

---

## 📝 Image এর জন্য:

### Basic Example:
```html
<img src="https://example.com/image.jpg" 
     alt="My Image" 
     class="lightbox-trigger" />
```

### Styled Image:
```html
<img src="https://example.com/image.jpg" 
     alt="Beautiful Landscape" 
     class="lightbox-trigger"
     style="width: 100%; max-width: 600px; border: 3px solid #2C2416; margin: 20px 0;" />
```

### Multiple Images (Gallery):
```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
  <img src="image1.jpg" alt="Image 1" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
  <img src="image2.jpg" alt="Image 2" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
  <img src="image3.jpg" alt="Image 3" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
  <img src="image4.jpg" alt="Image 4" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
  <img src="image5.jpg" alt="Image 5" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
  <img src="image6.jpg" alt="Image 6" class="lightbox-trigger" style="width: 100%; cursor: pointer;" />
</div>
```

---

## 🎥 Video এর জন্য:

### Basic Video:
```html
<video src="https://example.com/video.mp4" 
       class="lightbox-trigger"
       controls
       style="width: 100%; max-width: 800px; border: 3px solid #2C2416;">
  Your browser does not support video.
</video>
```

### Video with Poster:
```html
<video src="https://example.com/video.mp4" 
       poster="https://example.com/thumbnail.jpg"
       class="lightbox-trigger"
       controls
       style="width: 100%; border: 4px solid #2C2416; margin: 20px 0;">
</video>
```

---

## 🎬 YouTube Video Integration:

### Method 1: YouTube Lightbox (Recommended)
Click করলে full-screen lightbox এ YouTube video play হবে custom overlay সহ।

```html
<style>
  .youtube-preview {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border: 4px solid #2C2416;
    box-shadow: 6px 6px 0 0 rgba(44, 36, 22, 0.3);
    transition: all 0.2s;
  }
  
  .youtube-preview:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 0 rgba(44, 36, 22, 0.3);
  }
  
  .youtube-preview::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    color: white;
    background: rgba(255, 0, 0, 0.8);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 8px;
  }
</style>

<!-- Single YouTube Video -->
<img 
  src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
  alt="Amazing Tutorial Video" 
  class="lightbox-trigger youtube-preview"
  data-youtube="dQw4w9WgXcQ"
  style="width: 100%; max-width: 800px;" 
/>

<!-- Multiple YouTube Videos Gallery -->
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0;">
  <img 
    src="https://img.youtube.com/vi/VIDEO_ID_1/maxresdefault.jpg" 
    alt="Tutorial Part 1" 
    class="lightbox-trigger youtube-preview"
    data-youtube="VIDEO_ID_1"
  />
  <img 
    src="https://img.youtube.com/vi/VIDEO_ID_2/maxresdefault.jpg" 
    alt="Tutorial Part 2" 
    class="lightbox-trigger youtube-preview"
    data-youtube="VIDEO_ID_2"
  />
  <img 
    src="https://img.youtube.com/vi/VIDEO_ID_3/maxresdefault.jpg" 
    alt="Tutorial Part 3" 
    class="lightbox-trigger youtube-preview"
    data-youtube="VIDEO_ID_3"
  />
  <img 
    src="https://img.youtube.com/vi/VIDEO_ID_4/maxresdefault.jpg" 
    alt="Tutorial Part 4" 
    class="lightbox-trigger youtube-preview"
    data-youtube="VIDEO_ID_4"
  />
</div>
```

### Method 2: Direct YouTube Embed
সরাসরি page এ embedded video (no lightbox):

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border: 4px solid #2C2416;">
  <iframe 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    src="https://www.youtube.com/embed/VIDEO_ID" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```

### YouTube Video ID কিভাবে পাবেন:
YouTube URL থেকে Video ID বের করুন:
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

বা:
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

### YouTube Thumbnail URLs:
```
Default Quality:    https://img.youtube.com/vi/VIDEO_ID/default.jpg
Medium Quality:     https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg
High Quality:       https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
Max Quality:        https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg  (Best)
```

---

## 🎨 Styled Gallery Examples:

### Example 1: Simple Grid with Borders
```html
<style>
  .my-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .my-gallery img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border: 4px solid #2C2416;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .my-gallery img:hover {
    transform: scale(1.05);
  }
</style>

<div class="my-gallery">
  <img src="photo1.jpg" alt="Photo 1" class="lightbox-trigger" />
  <img src="photo2.jpg" alt="Photo 2" class="lightbox-trigger" />
  <img src="photo3.jpg" alt="Photo 3" class="lightbox-trigger" />
  <img src="photo4.jpg" alt="Photo 4" class="lightbox-trigger" />
</div>
```

### Example 2: Brutalist Style Gallery
```html
<style>
  .brutalist-gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 25px 0;
  }
  
  .brutalist-gallery img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border: 4px solid #2C2416;
    box-shadow: 6px 6px 0 0 rgba(44, 36, 22, 0.3);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .brutalist-gallery img:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 0 rgba(44, 36, 22, 0.3);
  }
</style>

<div class="brutalist-gallery">
  <img src="image1.jpg" alt="Gallery Image 1" class="lightbox-trigger" />
  <img src="image2.jpg" alt="Gallery Image 2" class="lightbox-trigger" />
  <img src="image3.jpg" alt="Gallery Image 3" class="lightbox-trigger" />
  <img src="image4.jpg" alt="Gallery Image 4" class="lightbox-trigger" />
  <img src="image5.jpg" alt="Gallery Image 5" class="lightbox-trigger" />
  <img src="image6.jpg" alt="Gallery Image 6" class="lightbox-trigger" />
</div>
```

### Example 3: Mixed Image, Video & YouTube Gallery
```html
<style>
  .media-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 30px 0;
  }
  
  .media-grid img,
  .media-grid video {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border: 3px solid #2C2416;
    cursor: pointer;
  }
  
  .youtube-thumb {
    position: relative;
  }
  
  .youtube-thumb::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    color: white;
    background: rgba(255, 0, 0, 0.8);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 6px;
  }
</style>

<div class="media-grid">
  <!-- Regular Image -->
  <img src="image1.jpg" alt="Screenshot" class="lightbox-trigger" />
  
  <!-- MP4 Video -->
  <video src="video1.mp4" class="lightbox-trigger" poster="video1-thumb.jpg"></video>
  
  <!-- YouTube Video -->
  <img 
    src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" 
    alt="YouTube Tutorial" 
    class="lightbox-trigger youtube-thumb"
    data-youtube="VIDEO_ID"
    style="height: 250px; object-fit: cover;"
  />
  
  <!-- Another Image -->
  <img src="image3.jpg" alt="Photo" class="lightbox-trigger" />
</div>
```

### Example 4: Complete Project Showcase
```html
<style>
  .project-showcase {
    max-width: 1200px;
    margin: 40px auto;
    padding: 30px;
    background: #F5F1E8;
    border: 4px solid #2C2416;
  }
  
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }
  
  .media-item {
    position: relative;
    border: 3px solid #2C2416;
    box-shadow: 5px 5px 0 0 rgba(44, 36, 22, 0.3);
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
  }
  
  .media-item:hover {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 0 rgba(44, 36, 22, 0.3);
  }
  
  .media-item img,
  .media-item video {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
  
  .media-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(44, 36, 22, 0.9);
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .yt-play-icon::after {
    content: '▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    color: white;
    background: rgba(255, 0, 0, 0.85);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 5px;
  }
</style>

<div class="project-showcase">
  <h2 style="font-size: 28px; font-weight: 900; color: #2C2416; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 3px solid #2C2416;">
    📁 Project Media Gallery
  </h2>
  
  <div class="showcase-grid">
    <!-- Screenshots -->
    <div class="media-item">
      <img src="screenshot1.jpg" alt="Home Page" class="lightbox-trigger" />
      <div class="media-label">🖼️ Home Page</div>
    </div>
    
    <div class="media-item">
      <img src="screenshot2.jpg" alt="Dashboard" class="lightbox-trigger" />
      <div class="media-label">🖼️ Dashboard</div>
    </div>
    
    <!-- Demo Video -->
    <div class="media-item">
      <video src="demo.mp4" poster="demo-thumb.jpg" class="lightbox-trigger"></video>
      <div class="media-label">🎥 Demo Video</div>
    </div>
    
    <!-- YouTube Tutorial -->
    <div class="media-item yt-play-icon">
      <img 
        src="https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg" 
        alt="Tutorial" 
        class="lightbox-trigger"
        data-youtube="YOUR_VIDEO_ID"
      />
      <div class="media-label">📺 Full Tutorial</div>
    </div>
    
    <!-- More Screenshots -->
    <div class="media-item">
      <img src="screenshot3.jpg" alt="Mobile View" class="lightbox-trigger" />
      <div class="media-label">📱 Mobile View</div>
    </div>
    
    <div class="media-item">
      <img src="screenshot4.jpg" alt="Features" class="lightbox-trigger" />
      <div class="media-label">✨ Features</div>
    </div>
  </div>
</div>
```

---

## ⚡ Features:

### ✅ Automatic Navigation:
- **Arrow Keys:** Left/Right arrow keys to navigate
- **Click Arrows:** Click left/right buttons
- **Counter:** Shows "1 / 5" (current / total)
- **ESC Key:** Close lightbox

### ✅ Multiple Media Support:
- যদি একই page এ একাধিক `lightbox-trigger` class থাকে, সব gallery navigation এ add হবে
- Image এবং video দুটোই support করে
- Automatic detection: IMG tag = image, VIDEO tag = video

### ✅ Responsive:
- Mobile এ touch-friendly
- Desktop এ keyboard navigation
- Full-screen viewing
- Auto-scaling for large images

---

## 🎯 Quick Tips:

### 1. **Always add cursor pointer:**
```html
<img src="image.jpg" class="lightbox-trigger" style="cursor: pointer;" />
```

### 2. **Google Drive Images:**
```html
<!-- Get shareable link, extract file ID, use this format: -->
<img src="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID" 
     alt="From Google Drive" 
     class="lightbox-trigger" />
```

### 3. **YouTube Videos:**
```html
<!-- Option 1: YouTube Thumbnail with Lightbox -->
<img 
  src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg" 
  alt="Video Title" 
  class="lightbox-trigger"
  data-youtube="VIDEO_ID"
  style="cursor: pointer; border: 4px solid #2C2416; width: 100%; max-width: 600px;" 
/>

<!-- Option 2: Direct Embed (No Lightbox) -->
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
  <iframe 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 4px solid #2C2416;"
    src="https://www.youtube.com/embed/VIDEO_ID" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```

### 4. **Multiple Galleries on Same Page:**
All images/videos with `lightbox-trigger` will be in the same gallery. If you want separate galleries, you'll need to use different class names (requires custom implementation).

---

## ❌ What NOT to Do:

### Don't use on background images:
```html
<!-- ❌ This won't work -->
<div style="background-image: url('image.jpg')" class="lightbox-trigger"></div>

<!-- ✅ Use img tag instead -->
<img src="image.jpg" class="lightbox-trigger" />
```

### Don't forget the class:
```html
<!-- ❌ Won't open in lightbox -->
<img src="image.jpg" />

<!-- ✅ Will open in lightbox -->
<img src="image.jpg" class="lightbox-trigger" />
```

---

## 📋 Complete Example Template:

```html
<style>
  .content-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 40px 0;
    padding: 20px;
    background: #F5F1E8;
    border: 4px solid #2C2416;
  }
  
  .content-gallery img,
  .content-gallery video {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border: 3px solid #2C2416;
    box-shadow: 4px 4px 0 0 rgba(44, 36, 22, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .content-gallery img:hover,
  .content-gallery video:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 rgba(44, 36, 22, 0.3);
  }
  
  .gallery-title {
    font-size: 24px;
    font-weight: 900;
    color: #2C2416;
    margin: 30px 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #2C2416;
  }
</style>

<h2 class="gallery-title">📸 Project Gallery</h2>

<div class="content-gallery">
  <img src="screenshot1.jpg" alt="Screenshot 1" class="lightbox-trigger" />
  <img src="screenshot2.jpg" alt="Screenshot 2" class="lightbox-trigger" />
  <img src="screenshot3.jpg" alt="Screenshot 3" class="lightbox-trigger" />
  <video src="demo-video.mp4" poster="video-thumb.jpg" class="lightbox-trigger"></video>
  <img src="screenshot4.jpg" alt="Screenshot 4" class="lightbox-trigger" />
  <img src="screenshot5.jpg" alt="Screenshot 5" class="lightbox-trigger" />
</div>
```

---

## 🚀 Summary:

1. **Images:** `class="lightbox-trigger"` to any `<img>`
2. **MP4 Videos:** `class="lightbox-trigger"` to any `<video>`
3. **YouTube Videos:** `class="lightbox-trigger"` + `data-youtube="VIDEO_ID"` to YouTube thumbnail `<img>`
4. **Style as needed:** Use any CSS you want
5. **Click to open:** Click করলে full-screen viewer এ open হবে
6. **Navigate:** Arrow keys বা click করে navigate করুন
7. **Close:** ESC key বা X button এ click করুন

### ✅ Supported Media Types:
- 🖼️ **Images:** JPG, PNG, GIF, WebP, SVG
- 🎥 **Videos:** MP4, WebM, OGG (direct video files)
- 📺 **YouTube:** Any YouTube video (via thumbnail + data-youtube attribute)

এটা automatically কাজ করবে blog posts, projects, এবং services সব pages এ! 🎉
