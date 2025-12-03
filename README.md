# Portfolio Website - Next.js 14 App Router

A full-stack, blazing-fast portfolio website with blog, projects showcase, and services management system.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (Production) / MockAPI (Development)
- **Caching**: SWR

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (home, blog, projects, services)
│   ├── auth/              # Authentication pages (login, signup)
│   ├── dashboard/         # Admin panel (protected)
│   └── api/               # API routes
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── common/            # Shared components (Icon, MediaViewer)
│   └── layouts/           # Layout themes (6 different layouts)
├── lib/                   # Utility functions & configs
│   ├── mockapi.ts         # MockAPI client
│   ├── supabase.ts        # Supabase client
│   ├── themes.ts          # Theme configurations
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── styles/                # Global CSS
```

## 🎨 Available Layouts

1. **CleanMagazineLayout** - Modern magazine-style grid
2. **CyberFlowLayout** - Futuristic tech theme with gradients
3. **HumanJournalLayout** - Timeline-based narrative
4. **ResearchPaperLayout** - Academic paper with TOC & themes
5. **StandardPostLayout** - Classic blog post with sidebar
6. **StrategicServiceLayout** - Service pages with Bento grid

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for authentication)
- MockAPI account (for development phase)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Setup environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Supabase URL and Anon Key
- MockAPI URL

3. **Run development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MOCKAPI_URL=https://your-id.mockapi.io/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Your Portfolio"
```

## 📊 MockAPI Setup (Development Phase)

Create these endpoints in MockAPI:

1. `/posts` - Blog posts
2. `/projects` - Portfolio projects
3. `/services` - Service offerings
4. `/orders` - Order submissions
5. `/testimonials` - Client testimonials

Example schema available in `docs/mockapi-schema.md`

## 🔐 Authentication

- Uses Supabase Auth
- Role-based access (admin/user)
- Protected admin dashboard with middleware
- Premium user features

## 🎯 Key Features

### Content Management
- ✅ Blog posts with markdown support
- ✅ Project showcase with tech stack
- ✅ Service pages with pricing packages
- ✅ Multiple layout themes per content type
- ✅ Rich media galleries (images/videos)
- ✅ Downloadable resources

### Admin Dashboard
- ✅ CRUD operations for all content
- ✅ Order management (confirm/reject)
- ✅ SEO settings per page
- ✅ Media uploader
- ✅ Analytics (coming soon)

### Performance
- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ SWR caching
- ✅ Optimized images
- ✅ Lazy loading
- ✅ Code splitting

### SEO/GEO/AEO
- ✅ Dynamic meta tags
- ✅ Schema.org JSON-LD
- ✅ Automatic sitemap
- ✅ robots.txt
- ✅ FAQ schema
- ✅ Local SEO (Bangladesh)
- ✅ Answer Engine Optimization

## 🗺️ Routing Structure

```
/                          # Homepage with Bento grid
/blog                      # Blog list
/blog/[slug]              # Single blog post
/projects                  # Projects list
/projects/[slug]          # Single project
/services                  # Services list
/services/[slug]          # Single service
/auth/login               # Login page
/auth/signup              # Signup page
/dashboard                # Admin panel home
/dashboard/posts          # Manage blog posts
/dashboard/projects       # Manage projects
/dashboard/services       # Manage services
/dashboard/orders         # Manage orders
```

## 🔄 Migration Plan (MockAPI → Supabase)

See `docs/migration-guide.md` for detailed instructions.

**Summary**:
1. Test all features with MockAPI
2. Export MockAPI data
3. Create Supabase SQL tables
4. Import data to Supabase
5. Update API calls
6. Final testing
7. Remove MockAPI

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Tested on iPhone 12/14/15 Pro Max, iPad, Samsung Tab, Desktop 1080p/1440p

## 🧪 Testing Checklist

- [ ] All CRUD operations
- [ ] Admin permissions
- [ ] Order submission flow
- [ ] Responsive design on all devices
- [ ] SEO meta tags
- [ ] Sitemap generation
- [ ] 404 and error pages
- [ ] Performance (Lighthouse score 90+)

## 📚 Documentation

- [Migration Guide](./docs/migration-guide.md)
- [MockAPI Schema](./docs/mockapi-schema.md)
- [Supabase Schema](./docs/supabase-schema.sql)
- [Theme Customization](./docs/themes.md)
- [Deployment Guide](./docs/deployment.md)

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 License

MIT License - feel free to use for your own portfolio!

## 👤 Author

Your Name - [Your Website](https://your-site.com)

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

---

**Built with ❤️ using Next.js 14**
