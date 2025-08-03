import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const latestPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di Blog Shofi
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Tempat berbagi cerita, pengalaman, dan pengetahuan. 
              Mari bergabung dalam komunitas penulis yang inspiratif.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/blog">Baca Blog</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/signup">Mulai Menulis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Blog Shofi?
            </h2>
            <p className="text-lg text-gray-600">
              Platform blog yang mudah digunakan dengan fitur lengkap
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mudah Menulis</h3>
                <p className="text-gray-600">
                  Editor yang intuitif memudahkan Anda menulis dan menformat artikel
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interaksi Komunitas</h3>
                <p className="text-gray-600">
                  Sistem komentar yang memungkinkan diskusi dan feedback dari pembaca
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Design Menarik</h3>
                <p className="text-gray-600">
                  Tampilan yang modern dan responsif dengan gambar berkualitas tinggi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Artikel Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Baca artikel-artikel terbaru dari para penulis kami
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Lihat Semua Artikel</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Menulis Anda?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas penulis dan mulai berbagi cerita Anda hari ini
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}