import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, truncateText } from '@/lib/utils';
import { Post } from '@/lib/db';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {formatDate(new Date(post.createdAt))}
          </Badge>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          {truncateText(post.excerpt, 120)}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Baca selengkapnya →
        </Link>
      </CardContent>
    </Card>
  );
}