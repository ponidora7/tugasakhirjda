import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import PostEditor from '@/components/PostEditor';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const post = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.id, parseInt(params.id)),
        eq(posts.authorId, parseInt(session.user.id))
      )
    )
    .limit(1);

  if (!post.length) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Artikel
          </h1>
          <p className="text-gray-600 mt-2">
            Perbarui artikel Anda
          </p>
        </div>
        
        <PostEditor post={post[0]} />
      </div>
    </div>
  );
}
