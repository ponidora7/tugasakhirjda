import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { formatDate } from '@/lib/utils';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        name: users.name,
      },
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, params.slug))
    .limit(1);

  if (!post.length || !post[0]) {
    notFound();
  }

  const postData = post[0];

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <Image
          src={postData.imageUrl || '/placeholder.jpg'}
          alt={postData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post Header */}
        <div className="py-12">
          <div className="mb-6">
            <Badge variant="secondary">
              {formatDate(new Date(postData.createdAt))}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {postData.title}
          </h1>

          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {postData.author?.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">
                {postData.author?.name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500">
                Dipublikasikan {formatDate(new Date(postData.createdAt))}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: postData.content.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* Comment Section */}
        <CommentSection postId={postData.id} />
      </div>
    </article>
  );
}