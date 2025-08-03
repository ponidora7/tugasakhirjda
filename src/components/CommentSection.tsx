'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId,
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Komentar ({comments.length})</h3>

      {session && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment}>
              <Textarea
                placeholder="Tulis komentar Anda..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button type="submit" disabled={loading || !newComment.trim()}>
                {loading ? 'Mengirim...' : 'Kirim Komentar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {comment.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(comment.createdAt))}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}