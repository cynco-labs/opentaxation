/**
 * Blog API - Supabase-powered blog system
 * Note: Blog tables need to be created using /supabase/blog-schema.sql
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { checkRateLimit, RATE_LIMITS } from './rateLimiter';
import type { Database, PostStatus, Locale } from '@/types/database';

// Re-export types for consumers
export type { PostStatus, Locale };

// ============================================
// CONSTANTS
// ============================================

/** Storage bucket name for blog images */
export const BLOG_IMAGES_BUCKET = 'blog-images';

/** PostgreSQL error codes */
const PGSQL_NOT_FOUND = 'PGRST116';

// ============================================
// TYPES
// ============================================

// Database row types
type AuthorRow = Database['public']['Tables']['blog_authors']['Row'];
type CategoryRow = Database['public']['Tables']['blog_categories']['Row'];
type TagRow = Database['public']['Tables']['blog_tags']['Row'];
type PostRow = Database['public']['Tables']['blog_posts']['Row'];
type CommentRow = Database['public']['Tables']['blog_comments']['Row'];

// Application types with relationships
export interface Author extends Omit<AuthorRow, 'email' | 'user_id' | 'is_active' | 'created_at' | 'updated_at'> {
  [key: string]: unknown;
}

export interface Category extends Omit<CategoryRow, 'sort_order' | 'created_at' | 'updated_at'> {
  [key: string]: unknown;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface BlogPost extends Omit<PostRow, 'author_id' | 'category_id' | 'scheduled_for'> {
  author: Author | null;
  category: Category | null;
  tags: Tag[];
}

export interface BlogPostInput {
  slug: string;
  locale?: Locale;
  title: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  author_id?: string;
  category_id?: string;
  status?: PostStatus;
  scheduled_for?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  is_featured?: boolean;
  reading_time_minutes?: number;
  tag_ids?: string[];
}

export interface Comment extends Omit<CommentRow, 'is_approved' | 'updated_at'> {
  replies?: Comment[];
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

// Raw query result types for type-safe transformations
interface PostWithRelations extends PostRow {
  author: AuthorRow | null;
  category: CategoryRow | null;
  tags: Array<{ tag: TagRow }>;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function ensureSupabase() {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Blog features are unavailable.');
  }
  return supabase;
}

/** Transform raw post data with relations to BlogPost type */
function transformPost(post: PostWithRelations): BlogPost {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { author_id, category_id, scheduled_for, tags, ...rest } = post;
  return {
    ...rest,
    author: post.author,
    category: post.category,
    tags: tags?.map((t) => t.tag).filter(Boolean) || [],
  };
}

/** Transform post without tags */
function transformPostWithoutTags(post: PostRow & { author: AuthorRow | null; category: CategoryRow | null }): BlogPost {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { author_id, category_id, scheduled_for, ...rest } = post;
  return {
    ...rest,
    author: post.author,
    category: post.category,
    tags: [],
  };
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  const localizedKey = `${field}_${locale}`;
  const fallbackKey = `${field}_en`;
  return (obj[localizedKey] as string) || (obj[fallbackKey] as string) || '';
}

export function formatBlogDate(dateString: string, locale: Locale = 'en'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'ms' ? 'ms-MY' : 'en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function sanitizeSearchTerm(term: string): string {
  return term
    .replace(/[%_,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

// ============================================
// POSTS API
// ============================================

/**
 * Fetch published posts with pagination
 */
export async function getPosts(options: {
  locale?: Locale;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  search?: string;
} = {}): Promise<{ posts: BlogPost[]; meta: PaginationMeta }> {
  const client = ensureSupabase();
  const {
    locale = 'en',
    page = 1,
    pageSize = 9,
    categorySlug,
    tagSlug,
    featured,
    search,
  } = options;

  const offset = (page - 1) * pageSize;

  let query = client
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `, { count: 'exact' })
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug);
  }

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  if (search) {
    const safeSearch = sanitizeSearchTerm(search);
    if (safeSearch) {
      query = query.or(
        `title.ilike.%${safeSearch}%,excerpt.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`
      );
    }
  }

  const { data, count, error } = await query;

  if (error) {
    throw error;
  }

  // Transform the data with proper typing
  const rawPosts = (data || []) as unknown as PostWithRelations[];
  const posts: BlogPost[] = rawPosts.map(transformPost);

  // Filter by tag if needed (done client-side due to junction table complexity)
  let filteredPosts = posts;
  if (tagSlug) {
    filteredPosts = posts.filter((post) =>
      post.tags.some((tag) => tag.slug === tagSlug)
    );
  }

  return {
    posts: filteredPosts,
    meta: {
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
      totalCount: count || 0,
    },
  };
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(
  slug: string,
  locale: Locale = 'en'
): Promise<BlogPost | null> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single();

  if (error) {
    if (error.code === PGSQL_NOT_FOUND) return null;
    throw error;
  }

  return transformPost(data as unknown as PostWithRelations);
}

/**
 * Get related posts (same category, excluding current)
 */
export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  locale: Locale = 'en',
  limit: number = 3
): Promise<BlogPost[]> {
  const client = ensureSupabase();

  let query = client
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('locale', locale)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  type PostWithAuthorCategory = PostRow & { author: AuthorRow | null; category: CategoryRow | null };
  return (data as unknown as PostWithAuthorCategory[] || []).map(transformPostWithoutTags);
}

/**
 * Increment post view count
 */
export async function incrementViewCount(slug: string): Promise<void> {
  const client = ensureSupabase();

  const { error } = await client.rpc('increment_post_view', {
    post_slug: slug,
  });

  if (error) {
    // Silently fail - view count is not critical
  }
}

// ============================================
// CATEGORIES API
// ============================================

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as Category[];
}

// ============================================
// TAGS API
// ============================================

/**
 * Fetch all tags
 */
export async function getTags(): Promise<Tag[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as Tag[];
}

// ============================================
// COMMENTS API
// ============================================

/**
 * Fetch comments for a post
 */
export async function getComments(postId: string): Promise<Comment[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  // Organize into tree structure
  const comments = (data || []) as Comment[];
  const rootComments = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  return rootComments.map((comment) => ({
    ...comment,
    replies: replies.filter((r) => r.parent_id === comment.id),
  }));
}

/**
 * Add a comment
 */
export async function addComment(
  postId: string,
  content: string,
  userId: string,
  userName: string,
  userAvatar?: string,
  parentId?: string,
  captchaToken?: string
): Promise<Comment> {
  const client = ensureSupabase();
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error('Comment cannot be empty.');
  }

  if (!checkRateLimit('comment-create', RATE_LIMITS.COMMENT)) {
    throw new Error('Please wait before posting another comment.');
  }

  const { data, error } = await client.functions.invoke('submit-comment', {
    body: {
      postId,
      content: trimmedContent,
      userId,
      userName,
      userAvatar,
      parentId,
      captchaToken,
    },
  });

  if (!error && data?.comment) {
    return data.comment as Comment;
  }

  const status = (error as { context?: { status?: number } })?.context?.status;
  if (status && status !== 404 && status !== 405) {
    throw new Error(data?.error || error?.message || 'Failed to add comment.');
  }

  const { data: fallbackData, error: fallbackError } = await client
    .from('blog_comments')
    .insert({
      post_id: postId,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      content: trimmedContent,
      parent_id: parentId,
      is_approved: false,
    })
    .select()
    .single();

  if (fallbackError) {
    throw fallbackError;
  }

  return fallbackData as Comment;
}

// ============================================
// BOOKMARKS API
// ============================================

/**
 * Check if user has bookmarked a post
 */
export async function isBookmarked(
  postId: string,
  userId: string
): Promise<boolean> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_bookmarks')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== PGSQL_NOT_FOUND) {
    // Silently fail - bookmark check is not critical
  }

  return !!data;
}

/**
 * Toggle bookmark
 */
export async function toggleBookmark(
  postId: string,
  userId: string
): Promise<boolean> {
  const client = ensureSupabase();
  const bookmarked = await isBookmarked(postId, userId);

  if (bookmarked) {
    const { error } = await client
      .from('blog_bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await client
      .from('blog_bookmarks')
      .insert({ post_id: postId, user_id: userId });

    if (error) throw error;
    return true;
  }
}

/**
 * Get user's bookmarked posts
 */
export async function getBookmarkedPosts(
  userId: string,
  locale: Locale = 'en'
): Promise<BlogPost[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_bookmarks')
    .select(`
      post:blog_posts(
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  type BookmarkWithPost = { post: (PostRow & { author: AuthorRow | null; category: CategoryRow | null }) | null };
  return ((data || []) as unknown as BookmarkWithPost[])
    .map((b) => b.post)
    .filter((p): p is NonNullable<typeof p> => p !== null && p.locale === locale)
    .map(transformPostWithoutTags);
}

// ============================================
// AUTHORS API
// ============================================

/**
 * Fetch all authors
 */
export async function getAuthors(): Promise<Author[]> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_authors')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as Author[];
}

// ============================================
// ADMIN API (for dashboard)
// ============================================

/**
 * Fetch all posts for admin (including drafts)
 */
export async function getAdminPosts(options: {
  page?: number;
  pageSize?: number;
  status?: PostStatus;
  locale?: Locale;
} = {}): Promise<{ posts: BlogPost[]; meta: PaginationMeta }> {
  const client = ensureSupabase();
  const { page = 1, pageSize = 20, status, locale } = options;
  const offset = (page - 1) * pageSize;

  let query = client
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) {
    query = query.eq('status', status);
  }

  if (locale) {
    query = query.eq('locale', locale);
  }

  const { data, count, error } = await query;

  if (error) {
    throw error;
  }

  type PostWithAuthorCategory = PostRow & { author: AuthorRow | null; category: CategoryRow | null };
  return {
    posts: ((data || []) as unknown as PostWithAuthorCategory[]).map(transformPostWithoutTags),
    meta: {
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
      totalCount: count || 0,
    },
  };
}

/**
 * Create a new post
 */
export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const client = ensureSupabase();
  const { tag_ids, ...postData } = input;

  const { data: post, error } = await client
    .from('blog_posts')
    .insert(postData)
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  // Add tags
  if (tag_ids && tag_ids.length > 0) {
    const tagInserts = tag_ids.map((tag_id) => ({
      post_id: post.id,
      tag_id,
    }));

    const { error: tagError } = await client
      .from('blog_post_tags')
      .insert(tagInserts);

    if (tagError) {
      // Tag insertion failed but post was created - continue
    }
  }

  type PostWithAuthorCategory = PostRow & { author: AuthorRow | null; category: CategoryRow | null };
  return transformPostWithoutTags(post as unknown as PostWithAuthorCategory);
}

/**
 * Update a post
 */
export async function updatePost(
  id: string,
  input: Partial<BlogPostInput>
): Promise<BlogPost> {
  const client = ensureSupabase();
  const { tag_ids, ...postData } = input;

  const { data: post, error } = await client
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `)
    .single();

  if (error) {
    throw error;
  }

  // Update tags if provided
  if (tag_ids !== undefined) {
    // Remove existing tags
    await client.from('blog_post_tags').delete().eq('post_id', id);

    // Add new tags
    if (tag_ids.length > 0) {
      const tagInserts = tag_ids.map((tag_id) => ({
        post_id: id,
        tag_id,
      }));

      await client.from('blog_post_tags').insert(tagInserts);
    }
  }

  type PostWithAuthorCategory = PostRow & { author: AuthorRow | null; category: CategoryRow | null };
  return transformPostWithoutTags(post as unknown as PostWithAuthorCategory);
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  const client = ensureSupabase();

  const { error } = await client.from('blog_posts').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

/**
 * Create or update a category
 */
export async function upsertCategory(
  category: Database['public']['Tables']['blog_categories']['Insert']
): Promise<Category> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_categories')
    .upsert(category, { onConflict: 'slug' })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Category;
}

/**
 * Create or update a tag
 */
export async function upsertTag(
  tag: Partial<Tag> & { slug: string; name: string }
): Promise<Tag> {
  const client = ensureSupabase();

  const { data, error } = await client
    .from('blog_tags')
    .upsert(tag, { onConflict: 'slug' })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Tag;
}
