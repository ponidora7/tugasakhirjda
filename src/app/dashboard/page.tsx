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
import { PlusCircle, FileText, Eye, MessageSquare } from 'lucide-react';

export default async function Dashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, parseInt(session.user.id)))
    .orderBy(desc(posts.createdAt));

  const publishedPosts = userPosts.filter(post => post.published);
  const draftPosts = userPosts.filter(post => !post.published);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali, {session.user.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPosts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dipublikasikan</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Komentar</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Button asChild size="lg">
            <Link href="/dashboard/posts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tulis Artikel Baru
            </Link>
          </Button>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Artikel Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Anda belum memiliki artikel. Mulai menulis sekarang!
                </p>
                <Button asChild>
                  <Link href="/dashboard/posts/new">Tulis Artikel Pertama</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(new Date(post.createdAt))}
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
                    </div>
                  </div>
                ))}
                {userPosts.length > 5 && (
                  <div className="text-center pt-4">
                    <Button asChild variant="outline">
                      <Link href="/dashboard/posts">Lihat Semua Artikel</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
