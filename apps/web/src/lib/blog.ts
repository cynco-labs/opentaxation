/**
 * Blog types and utilities
 *
 * Data fetching is now handled by Convex queries/mutations in convex/blogPosts.ts.
 * Components should use useQuery/useMutation from convex/react directly.
 * This file provides types, constants, and utility functions.
 */

// ─── Types ───────────────────────────────────────────────────────────

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type Locale = 'en' | 'ms';

export interface Author {
  id?: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  [key: string]: unknown;
}

export interface Tag {
  id?: string;
  slug: string;
  name: string;
}

export interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  coverImageId?: string;
  author: Author | null;
  category: Category | null;
  tags: Tag[];
  status: PostStatus;
  locale: Locale;
  publishedAt?: string;
  published_at?: string; // compat alias
  metaTitle?: string;
  metaDescription?: string;
  meta_title?: string; // compat alias
  meta_description?: string; // compat alias
  readingTimeMinutes?: number;
  reading_time_minutes?: number; // compat alias
  viewCount: number;
  view_count?: number; // compat alias
  isFeatured?: boolean;
  is_featured?: boolean; // compat alias
  _creationTime: number;
  [key: string]: unknown;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImageId?: string;
  categoryId?: string;
  status: PostStatus;
  locale: Locale;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMinutes?: number;
  tagIds?: string[];
  publishedAt?: string;
}

export interface Comment {
  _id: string;
  id?: string;
  postId: string;
  userId: string;
  parentId?: string;
  content: string;
  authorName: string;
  _creationTime: number;
  [key: string]: unknown;
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Utility Functions ───────────────────────────────────────────────

/**
 * Get a localized field value from a record
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  record: T,
  field: string,
  locale: Locale = 'en',
): unknown {
  const localizedKey = `${field}_${locale}`;
  return (record[localizedKey] as unknown) ?? record[field];
}

/**
 * Format a blog date string for display
 */
export function formatBlogDate(dateString: string, locale: Locale = 'en'): string {
  const date = new Date(dateString);
  const langCode = locale === 'ms' ? 'ms-MY' : 'en-MY';

  return date.toLocaleDateString(langCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Estimate reading time for content
 */
export function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
