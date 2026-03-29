import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";
import { Id } from "./_generated/dataModel";

// ─── Helper: check admin ─────────────────────────────────────────────
async function requireBlogAdmin(ctx: { db: any; auth: any }) {
  const userId = await getAuthUserId(ctx as any);
  if (!userId) throw new Error("Not authenticated");

  const author = await ctx.db
    .query("blogAuthors")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .first();

  if (!author?.isActive) {
    // Try email fallback
    const user = await ctx.db.get(userId);
    if (user?.email) {
      const byEmail = await ctx.db
        .query("blogAuthors")
        .withIndex("by_email", (q: any) => q.eq("email", user.email))
        .first();
      if (byEmail?.isActive) return byEmail;
    }
    throw new Error("Not a blog admin");
  }
  return author;
}

// ─── Helper: resolve image URLs ──────────────────────────────────────
async function resolvePostImage(
  ctx: { storage: any },
  post: any,
) {
  if (post.coverImageId) {
    const url = await ctx.storage.getUrl(post.coverImageId);
    return { ...post, coverImageUrl: url ?? post.coverImageUrl };
  }
  return post;
}

// ─── Public queries ──────────────────────────────────────────────────

export const listPublished = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("ms"))),
    categoryId: v.optional(v.id("blogCategories")),
    featured: v.optional(v.boolean()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    let posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    // Filter
    const now = new Date().toISOString();
    posts = posts.filter((p) => !p.publishedAt || p.publishedAt <= now);
    if (args.locale) posts = posts.filter((p) => p.locale === args.locale);
    if (args.categoryId)
      posts = posts.filter((p) => p.categoryId === args.categoryId);
    if (args.featured !== undefined)
      posts = posts.filter((p) => p.isFeatured === args.featured);
    if (args.search) {
      const s = args.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.excerpt?.toLowerCase().includes(s),
      );
    }

    const totalCount = posts.length;

    // Paginate via cursor (using _creationTime as cursor)
    if (args.cursor) {
      const cursorTime = parseFloat(args.cursor);
      posts = posts.filter((p) => p._creationTime < cursorTime);
    }

    const page = posts.slice(0, limit);
    const resolved = await Promise.all(page.map((p) => resolvePostImage(ctx, p)));

    // Load author + category + tags for each post
    const enriched = await Promise.all(
      resolved.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        const category = post.categoryId
          ? await ctx.db.get(post.categoryId)
          : null;
        const postTags = await ctx.db
          .query("blogPostTags")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();
        const tags = await Promise.all(
          postTags.map((pt) => ctx.db.get(pt.tagId)),
        );
        return {
          ...post,
          author: author ? { name: author.name, avatarUrl: author.avatarUrl } : null,
          category: category ? { name: category.name, slug: category.slug } : null,
          tags: tags.filter(Boolean).map((t) => ({ name: t!.name, slug: t!.slug })),
        };
      }),
    );

    return {
      posts: enriched,
      nextCursor:
        page.length === limit
          ? String(page[page.length - 1]._creationTime)
          : null,
      totalCount,
    };
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("ms"))),
  },
  handler: async (ctx, { slug, locale }) => {
    let post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!post || post.status !== "published") return null;
    if (locale && post.locale !== locale) return null;

    post = await resolvePostImage(ctx, post);

    const author = await ctx.db.get(post.authorId);
    const category = post.categoryId
      ? await ctx.db.get(post.categoryId)
      : null;
    const postTags = await ctx.db
      .query("blogPostTags")
      .withIndex("by_post", (q) => q.eq("postId", post!._id))
      .collect();
    const tags = await Promise.all(postTags.map((pt) => ctx.db.get(pt.tagId)));

    return {
      ...post,
      author: author
        ? { id: author._id, name: author.name, bio: author.bio, avatarUrl: author.avatarUrl }
        : null,
      category: category ? { id: category._id, name: category.name, slug: category.slug } : null,
      tags: tags
        .filter(Boolean)
        .map((t) => ({ id: t!._id, name: t!.name, slug: t!.slug })),
    };
  },
});

export const getRelated = query({
  args: {
    postId: v.id("blogPosts"),
    categoryId: v.optional(v.id("blogCategories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { postId, categoryId, limit: lim }) => {
    const limit = lim ?? 3;
    let posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    posts = posts.filter((p) => p._id !== postId);
    if (categoryId) {
      const sameCat = posts.filter((p) => p.categoryId === categoryId);
      posts = sameCat.length >= limit ? sameCat : posts;
    }

    const page = posts.slice(0, limit);
    return Promise.all(page.map((p) => resolvePostImage(ctx, p)));
  },
});

export const incrementViewCount = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (post) {
      await ctx.db.patch(post._id, { viewCount: post.viewCount + 1 });
    }
  },
});

// ─── Admin queries/mutations ─────────────────────────────────────────

export const listAdmin = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("scheduled"),
        v.literal("archived"),
      ),
    ),
    locale: v.optional(v.union(v.literal("en"), v.literal("ms"))),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Auth check - must be blog admin
    const userId = await getAuthUserId(ctx);
    if (!userId) return { posts: [], meta: { totalCount: 0, page: 1, pageSize: 10, totalPages: 0 } };

    let posts = await ctx.db.query("blogPosts").order("desc").collect();

    if (args.status) posts = posts.filter((p) => p.status === args.status);
    if (args.locale) posts = posts.filter((p) => p.locale === args.locale);

    const totalCount = posts.length;
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 10;
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const paged = posts.slice(offset, offset + pageSize);

    const enriched = await Promise.all(
      paged.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          id: post._id,
          author: author ? { name: author.name } : null,
        };
      }),
    );

    return {
      posts: enriched,
      meta: { totalCount, page, pageSize, totalPages },
    };
  },
});

export const getById = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const post = await ctx.db.get(id);
    if (!post) return null;

    const resolved = await resolvePostImage(ctx, post);

    // Get tags
    const postTags = await ctx.db
      .query("blogPostTags")
      .withIndex("by_post", (q) => q.eq("postId", id))
      .collect();
    const tagIds = postTags.map((pt) => pt.tagId);

    return { ...resolved, id: post._id, tag_ids: tagIds };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    categoryId: v.optional(v.id("blogCategories")),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("scheduled"),
      v.literal("archived"),
    ),
    locale: v.union(v.literal("en"), v.literal("ms")),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    readingTimeMinutes: v.optional(v.number()),
    tagIds: v.optional(v.array(v.id("blogTags"))),
    publishedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const author = await requireBlogAdmin(ctx);
    const { tagIds, ...postData } = args;

    const postId = await ctx.db.insert("blogPosts", {
      ...postData,
      authorId: author._id,
      viewCount: 0,
    });

    // Insert tags
    if (tagIds?.length) {
      await Promise.all(
        tagIds.map((tagId) =>
          ctx.db.insert("blogPostTags", { postId, tagId }),
        ),
      );
    }

    return postId;
  },
});

export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    categoryId: v.optional(v.id("blogCategories")),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("scheduled"),
        v.literal("archived"),
      ),
    ),
    locale: v.optional(v.union(v.literal("en"), v.literal("ms"))),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    readingTimeMinutes: v.optional(v.number()),
    tagIds: v.optional(v.array(v.id("blogTags"))),
    publishedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireBlogAdmin(ctx);
    const { id, tagIds, ...updates } = args;

    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");

    // Remove undefined values
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(id, patch);
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      // Delete existing tags
      const existing = await ctx.db
        .query("blogPostTags")
        .withIndex("by_post", (q) => q.eq("postId", id))
        .collect();
      await Promise.all(existing.map((t) => ctx.db.delete(t._id)));

      // Insert new tags
      await Promise.all(
        tagIds.map((tagId) =>
          ctx.db.insert("blogPostTags", { postId: id, tagId }),
        ),
      );
    }
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    await requireBlogAdmin(ctx);

    // Delete tags
    const tags = await ctx.db
      .query("blogPostTags")
      .withIndex("by_post", (q) => q.eq("postId", id))
      .collect();
    await Promise.all(tags.map((t) => ctx.db.delete(t._id)));

    // Delete comments
    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_post", (q) => q.eq("postId", id))
      .collect();
    await Promise.all(comments.map((c) => ctx.db.delete(c._id)));

    // Delete bookmarks
    const bookmarks = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_post_user", (q) => q.eq("postId", id))
      .collect();
    await Promise.all(bookmarks.map((b) => ctx.db.delete(b._id)));

    await ctx.db.delete(id);
  },
});
