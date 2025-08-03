import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { generateSlug, getUnsplashImage } from '@/lib/utils';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(allPosts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, excerpt, published = false } = await req.json();

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Title, content, dan excerpt harus diisi' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const imageUrl = await getUnsplashImage(title);

    const newPost = await db.insert(posts).values({
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      published,
      authorId: parseInt(session.user.id),
    }).returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat post' },
      { status: 500 }
    );
  }
}
