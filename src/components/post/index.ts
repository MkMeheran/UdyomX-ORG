// Post System - Main Export File

// Components
export { PostLayout } from './PostLayout';
export { StandardPostLayout } from './layouts/StandardPostLayout';
export { ResearchPaperLayout } from './layouts/ResearchPaperLayout';
export { PostCard } from './PostCard';
export { PostAuthors } from './PostAuthors';
export { PostMeta } from './PostMeta';
export { PostTOC } from './PostTOC';
export { PostGallery } from './PostGallery';
export { PostDownloads } from './PostDownloads';
export { PostRecommended } from './PostRecommended';
export { AudienceBadge } from './AudienceBadge';

// Themes
export { researchPaperThemes, defaultTheme } from './themes/researchPaperThemes';
export { getThemeStyles, getThemeCSSVariables } from './themes/getThemeStyles';
export { ResearchPaperThemeToggle } from './themes/ResearchPaperThemeToggle';

// Types (re-export from main types)
export type {
    Post,
    PostCardData,
    Author,
    MediaItem,
    PostDownloadItem,
    RecommendedPost,
    RecommendedContent,
    PostSEO,
    AudienceType,
    PostLayoutType,
    PostStatus,
    TOCItem,
    BusinessInfo,
    PostUser,
    ResearchPaperTheme,
    ThemeConfig,
} from '@/types/post';
