import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for storage operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bucket names
export const BUCKETS = {
    GALLERY: 'gallery',
    DOWNLOADS: 'downloads',
    THUMBNAILS: 'thumbnails',
};

// File size limits (in bytes)
export const FILE_LIMITS = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 50 * 1024 * 1024, // 50MB
    DOWNLOAD: 25 * 1024 * 1024, // 25MB
};

// Allowed file types
export const ALLOWED_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
    DOWNLOAD: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-rar-compressed',
        'image/jpeg',
        'image/png',
        'image/gif',
    ],
};

export interface UploadResult {
    success: boolean;
    url?: string;
    path?: string;
    error?: string;
    fileSize?: string;
    fileType?: string;
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename or mime type
 */
export function getFileExtension(filename: string, mimeType?: string): string {
    // Try to get from filename first
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext) return ext;
    
    // Fallback to mime type
    const mimeMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/zip': 'zip',
    };
    
    return mimeType ? (mimeMap[mimeType] || 'file') : 'file';
}

/**
 * Generate unique filename for upload
 */
function generateUniqueFilename(originalName: string, folder?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = getFileExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    
    const filename = `${baseName}_${timestamp}_${random}.${ext}`;
    return folder ? `${folder}/${filename}` : filename;
}

/**
 * Upload image to gallery bucket
 */
export async function uploadGalleryImage(
    file: File,
    folder?: string
): Promise<UploadResult> {
    try {
        // Validate file type
        if (!ALLOWED_TYPES.IMAGE.includes(file.type) && !ALLOWED_TYPES.VIDEO.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP, MP4, WEBM' };
        }
        
        // Validate file size
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? FILE_LIMITS.VIDEO : FILE_LIMITS.IMAGE;
        if (file.size > maxSize) {
            return { success: false, error: `File too large. Max size: ${formatFileSize(maxSize)}` };
        }
        
        // Generate unique filename
        const filePath = generateUniqueFilename(file.name, folder);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKETS.GALLERY)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });
        
        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: error.message };
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKETS.GALLERY)
            .getPublicUrl(data.path);
        
        return {
            success: true,
            url: urlData.publicUrl,
            path: data.path,
            fileSize: formatFileSize(file.size),
            fileType: isVideo ? 'video' : 'image',
        };
    } catch (error: any) {
        console.error('Upload exception:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

/**
 * Upload file to downloads bucket
 */
export async function uploadDownloadFile(
    file: File,
    folder?: string
): Promise<UploadResult> {
    try {
        // Validate file type
        if (!ALLOWED_TYPES.DOWNLOAD.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR, Images' };
        }
        
        // Validate file size
        if (file.size > FILE_LIMITS.DOWNLOAD) {
            return { success: false, error: `File too large. Max size: ${formatFileSize(FILE_LIMITS.DOWNLOAD)}` };
        }
        
        // Generate unique filename
        const filePath = generateUniqueFilename(file.name, folder);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKETS.DOWNLOADS)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });
        
        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: error.message };
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKETS.DOWNLOADS)
            .getPublicUrl(data.path);
        
        const ext = getFileExtension(file.name, file.type);
        
        return {
            success: true,
            url: urlData.publicUrl,
            path: data.path,
            fileSize: formatFileSize(file.size),
            fileType: ext.toUpperCase(),
        };
    } catch (error: any) {
        console.error('Upload exception:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

/**
 * Upload thumbnail image
 */
export async function uploadThumbnail(
    file: File,
    folder?: string
): Promise<UploadResult> {
    try {
        // Validate file type - only images for thumbnails
        if (!ALLOWED_TYPES.IMAGE.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP' };
        }
        
        // Validate file size
        if (file.size > FILE_LIMITS.IMAGE) {
            return { success: false, error: `File too large. Max size: ${formatFileSize(FILE_LIMITS.IMAGE)}` };
        }
        
        // Generate unique filename
        const filePath = generateUniqueFilename(file.name, folder);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKETS.THUMBNAILS)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });
        
        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: error.message };
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKETS.THUMBNAILS)
            .getPublicUrl(data.path);
        
        return {
            success: true,
            url: urlData.publicUrl,
            path: data.path,
            fileSize: formatFileSize(file.size),
        };
    } catch (error: any) {
        console.error('Upload exception:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);
        
        if (error) {
            console.error('Delete error:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Delete exception:', error);
        return false;
    }
}

/**
 * Get signed URL for private files (if needed)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);
        
        if (error) {
            console.error('Signed URL error:', error);
            return null;
        }
        
        return data.signedUrl;
    } catch (error) {
        console.error('Signed URL exception:', error);
        return null;
    }
}
