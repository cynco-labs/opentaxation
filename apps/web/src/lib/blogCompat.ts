/**
 * Blog Compatibility Layer
 *
 * Provides imperative async functions that bridge old Supabase-style API calls
 * to Convex. Used by blog components during migration.
 *
 * Components should eventually migrate to useQuery/useMutation directly.
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type {
  BlogPost,
  BlogPostInput,
  PostStatus,
  Locale,
  Category,
  Tag,
  Author,
  Comment,
  PaginationMeta,
} from './blog';

// HTTP client for imperative calls (non-reactive, for compatibility)
function getClient() {
  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url) throw new Error('VITE_CONVEX_URL not set');
  return new ConvexHttpClient(url);
}

// ─── Posts ────────────────────────────────────────────────────────────

export async function getPosts(options: {
  page?: number;
  pageSize?: number;
  locale?: Locale;
  category?: string;
  featured?: boolean;
  search?: string;
} = {}): Promise<{ posts: BlogPost[]; meta: PaginationMeta }> {
  const client = getClient();
  const result = await client.query(api.blogPosts.listPublished, {
    locale: options.locale,
    search: options.search,
    limit: options.pageSize ?? 10,
  });

  return {
    posts: result.posts as unknown as BlogPost[],
    meta: {
      totalCount: result.totalCount,
      page: options.page ?? 1,
      pageSize: options.pageSize ?? 10,
      totalPages: Math.ceil(result.totalCount / (options.pageSize ?? 10)),
    },
  };
}

export async function getPostBySlug(slug: string, locale?: Locale): Promise<BlogPost | null> {
  const client = getClient();
  const post = await client.query(api.blogPosts.getBySlug, { slug, locale });
  return post as unknown as BlogPost | null;
}

export async function getRelatedPosts(postId: string, categoryId?: string, limit?: number): Promise<BlogPost[]> {
  const client = getClient();
  const posts = await client.query(api.blogPosts.getRelated, {
    postId: postId as Id<"blogPosts">,
    categoryId: categoryId as Id<"blogCategories"> | undefined,
    limit,
  });
  return posts as unknown as BlogPost[];
}

export async function incrementViewCount(slug: string): Promise<void> {
  const client = getClient();
  await client.mutation(api.blogPosts.incrementViewCount, { slug });
}

export async function getAdminPosts(options: {
  page?: number;
  pageSize?: number;
  status?: PostStatus;
  locale?: Locale;
} = {}): Promise<{ posts: BlogPost[]; meta: PaginationMeta }> {
  const client = getClient();
  const result = await client.query(api.blogPosts.listAdmin, {
    status: options.status as PostStatus,
    locale: options.locale as Locale,
    page: options.page,
    pageSize: options.pageSize,
  });

  return {
    posts: result.posts as unknown as BlogPost[],
    meta: result.meta,
  };
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const client = getClient();
  const id = await client.mutation(api.blogPosts.create, {
    title: input.title,
    slug: input.slug,
    content: input.content,
    excerpt: input.excerpt,
    coverImageId: input.coverImageId as Id<"_storage"> | undefined,
    categoryId: input.categoryId as Id<"blogCategories"> | undefined,
    status: input.status,
    locale: input.locale,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    readingTimeMinutes: input.readingTimeMinutes,
    tagIds: input.tagIds as Id<"blogTags">[] | undefined,
    publishedAt: input.publishedAt,
  });

  return { _id: id, id, ...input } as unknown as BlogPost;
}

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<void> {
  const client = getClient();
  await client.mutation(api.blogPosts.update, {
    id: id as Id<"blogPosts">,
    title: input.title,
    slug: input.slug,
    content: input.content,
    excerpt: input.excerpt,
    coverImageId: input.coverImageId as Id<"_storage"> | undefined,
    categoryId: input.categoryId as Id<"blogCategories"> | undefined,
    status: input.status as PostStatus,
    locale: input.locale as Locale,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    readingTimeMinutes: input.readingTimeMinutes,
    tagIds: input.tagIds as Id<"blogTags">[] | undefined,
    publishedAt: input.publishedAt,
  });
}

export async function deletePost(id: string): Promise<void> {
  const client = getClient();
  await client.mutation(api.blogPosts.remove, { id: id as Id<"blogPosts"> });
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const client = getClient();
  const post = await client.query(api.blogPosts.getById, {
    id: id as Id<"blogPosts">,
  });
  return post as unknown as BlogPost | null;
}

// ─── Categories & Tags ───────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const client = getClient();
  const cats = await client.query(api.blogCategories.list, {});
  return cats as unknown as Category[];
}

export async function getTags(): Promise<Tag[]> {
  const client = getClient();
  const tags = await client.query(api.blogTags.list, {});
  return tags as unknown as Tag[];
}

export async function getAuthors(): Promise<Author[]> {
  const client = getClient();
  const authors = await client.query(api.blogAuthors.list, {});
  return authors as unknown as Author[];
}

// ─── Comments ────────────────────────────────────────────────────────

export async function getComments(postId: string): Promise<Comment[]> {
  const client = getClient();
  const comments = await client.query(api.blogComments.listByPost, {
    postId: postId as Id<"blogPosts">,
  });
  return comments as unknown as Comment[];
}

export async function addComment(postId: string, content: string, parentId?: string): Promise<void> {
  const client = getClient();
  await client.mutation(api.blogComments.add, {
    postId: postId as Id<"blogPosts">,
    content,
    parentId: parentId as Id<"blogComments"> | undefined,
  });
}

// ─── Bookmarks ───────────────────────────────────────────────────────

export async function isBookmarked(postId: string): Promise<boolean> {
  const client = getClient();
  return await client.query(api.blogBookmarks.isBookmarked, {
    postId: postId as Id<"blogPosts">,
  });
}

export async function toggleBookmark(postId: string): Promise<boolean> {
  const client = getClient();
  return await client.mutation(api.blogBookmarks.toggle, {
    postId: postId as Id<"blogPosts">,
  });
}

export async function getBookmarkedPosts(): Promise<BlogPost[]> {
  const client = getClient();
  const posts = await client.query(api.blogBookmarks.listByUser, {});
  return posts as unknown as BlogPost[];
}
