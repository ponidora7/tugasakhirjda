import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import PostCard from '@/components/PostCard';

export default async function BlogPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Semua Artikel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi artikel menarik dari berbagai topik yang telah ditulis oleh komunitas kami
          </p>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada artikel yang dipublikasikan.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
