import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import DeletePostButton from '@/components/DeletePostButton';

export default async function PostsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, parseInt(session.user.id)))
    .orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Artikel Saya
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola semua artikel yang telah Anda tulis
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tulis Artikel Baru
            </Link>
          </Button>
        </div>

        {userPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Anda belum memiliki artikel. Mulai menulis sekarang!
              </p>
              <Button asChild>
                <Link href="/dashboard/posts/new">Tulis Artikel Pertama</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {userPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">
                          {post.title}
                        </CardTitle>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Dibuat: {formatDate(new Date(post.createdAt))}
                        {post.updatedAt !== post.createdAt && (
                          <span> • Diupdate: {formatDate(new Date(post.updatedAt))}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      {post.published && (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/blog/${post.slug}`}>
                            Lihat
                          </Link>
                        </Button>
                      )}
                      <DeletePostButton postId={post.id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}