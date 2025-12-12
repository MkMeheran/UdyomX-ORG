# Custom CSS Guide for HTML Content

## ✅ What's Fixed:

1. **Custom CSS now works** in HTML content (blog posts, projects, services)
2. **Preview section updated** - Custom CSS will show in editor preview
3. **Back button fixed** - Now goes to correct admin page (/dashboard/admin/blogs)

---

## 📝 How to Use Custom CSS in Content:

### Method 1: Inline Styles (Highest Priority)
```html
<p style="color: red; font-size: 24px;">This text is red and 24px</p>
<h2 style="background: yellow; padding: 10px;">Yellow heading</h2>
```

### Method 2: Embedded Styles (Recommended)
```html
<style>
  .custom-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
  }
  
  .highlight {
    background: #FFF3CD;
    border-left: 4px solid #FFC107;
    padding: 15px;
    margin: 10px 0;
  }
</style>

<div class="custom-box">
  <h3>Custom Styled Box</h3>
  <p>This box has a gradient background!</p>
</div>

<div class="highlight">
  <p>This is a highlighted section</p>
</div>
```

### Method 3: Class-Based Styles
```html
<style>
  .feature-card {
    border: 3px solid #2C2416;
    padding: 20px;
    box-shadow: 6px 6px 0 rgba(44,36,22,0.3);
  }
  
  .feature-card h3 {
    color: #D35400;
    font-weight: 900;
  }
</style>

<div class="feature-card">
  <h3>Feature Title</h3>
  <p>Feature description goes here</p>
</div>
```

---

## 🎨 Default Styles (Applied Automatically):

### Text Styles:
- **Paragraph (`<p>`)**: 
  - Color: #5A5247 (brown-gray)
  - Line height: 1.8
  - Font weight: Medium
  - Margin bottom: 16px

### Heading Styles:

**H1:**
- Font weight: 900 (Black)
- Color: #2C2416 (dark brown)
- Font size: 32px
- Margin: 48px top, 16px bottom

**H2:**
- Font weight: 900 (Black)
- Color: #2C2416
- Font size: 26px
- Margin: 40px top, 16px bottom
- Border bottom: 3px solid #2C2416
- Padding bottom: 12px

**H3:**
- Font weight: 900 (Black)
- Color: #2C2416
- Font size: 20px
- Margin: 24px top, 12px bottom

### Link Styles:
- Color: #2196F3 (blue)
- Font weight: Bold
- No underline
- Hover color: #D35400 (orange)

### Code Styles:
- Inline code: Orange text (#D35400) on light gray background
- Code blocks: White text on dark background (#2C2416)

### List Styles:
- Unordered lists: Disc bullets, left margin 24px
- Ordered lists: Decimal numbers, left margin 24px
- List items: Brown-gray text, medium weight

---

## 🔧 Override Default Styles:

To override default styles, use more specific selectors or inline styles:

```html
<style>
  /* Override H2 border color */
  h2.custom-heading {
    border-bottom-color: #FF6B6B !important;
  }
  
  /* Override paragraph text color */
  p.intro-text {
    color: #2C2416 !important;
    font-size: 18px !important;
  }
  
  /* Custom link style */
  a.cta-button {
    background: #F5C542;
    color: #2C2416;
    padding: 10px 20px;
    border: 3px solid #2C2416;
    display: inline-block;
    text-decoration: none;
    font-weight: 900;
  }
</style>

<h2 class="custom-heading">Custom Styled Heading</h2>
<p class="intro-text">This paragraph has custom styling</p>
<a href="#" class="cta-button">Click Me</a>
```

---

## ⚠️ Important Notes:

1. **Style tag position**: Put `<style>` tags at the beginning of your content
2. **CSS priority**: Inline styles > Embedded styles > Default styles
3. **Preview works**: Custom CSS will show correctly in editor preview
4. **Production ready**: Works in both preview and live site
5. **No conflicts**: Custom CSS won't be overridden by default styles

---

## 🎯 Common Use Cases:

### Colored Boxes:
```html
<style>
  .info-box { background: #E3F2FD; border-left: 4px solid #2196F3; padding: 15px; }
  .warning-box { background: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; }
  .success-box { background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; }
</style>

<div class="info-box">ℹ️ This is an info box</div>
<div class="warning-box">⚠️ This is a warning box</div>
<div class="success-box">✅ This is a success box</div>
```

### Custom Buttons:
```html
<style>
  .btn {
    padding: 12px 24px;
    border: 3px solid #2C2416;
    font-weight: 900;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }
  .btn-primary { background: #F5C542; color: #2C2416; }
  .btn-secondary { background: #2196F3; color: white; }
</style>

<a href="#" class="btn btn-primary">Primary Button</a>
<a href="#" class="btn btn-secondary">Secondary Button</a>
```

### Grid Layout:
```html
<style>
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
  }
</style>

<div class="grid-2">
  <div>Column 1 content</div>
  <div>Column 2 content</div>
</div>
```

---

## 🚀 Quick Test:

Copy this into your content editor to test:

```html
<style>
  .test-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    margin: 20px 0;
  }
  
  .test-box h2 {
    color: white !important;
    border: none !important;
    margin: 0 0 10px 0 !important;
  }
</style>

<div class="test-box">
  <h2>🎨 Custom CSS Works!</h2>
  <p>If you see this styled box, custom CSS is working perfectly!</p>
</div>
```

---

## 📌 Summary:

✅ Custom CSS fully supported in HTML content  
✅ Preview shows custom styles correctly  
✅ Inline, embedded, and class-based styles all work  
✅ Default styles won't override your custom CSS  
✅ Use `!important` if needed to override defaults  

Happy styling! 🎨
