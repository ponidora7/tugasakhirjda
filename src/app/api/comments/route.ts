import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { comments, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId diperlukan' },
        { status: 400 }
      );
    }

    const postComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        author: {
          name: users.name,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, parseInt(postId)))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(postComments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil comments' },
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

    const { content, postId } = await req.json();

    if (!content || !postId) {
      return NextResponse.json(
        { error: 'Content dan postId harus diisi' },
        { status: 400 }
      );
    }

    const newComment = await db.insert(comments).values({
      content,
      postId: parseInt(postId),
      authorId: parseInt(session.user.id),
    }).returning();

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal membuat comment' },
      { status: 500 }
    );
  }
}