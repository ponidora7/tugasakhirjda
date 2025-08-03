import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateSlug } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, parseInt(params.id)))
      .limit(1);

    if (!post.length) {
      return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(post[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, excerpt, published } = await req.json();
    const slug = generateSlug(title);

    const updatedPost = await db
      .update(posts)
      .set({
        title,
        slug,
        content,
        excerpt,
        published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengupdate post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.delete(posts).where(eq(posts.id, parseInt(params.id)));

    return NextResponse.json({ message: 'Post berhasil dihapus' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal menghapus post' },
      { status: 500 }
    );
  }
}