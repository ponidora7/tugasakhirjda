'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Post } from '@/lib/db';

interface PostEditorProps {
  post?: Post;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    published: post?.published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts';
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/posts');
        router.refresh();
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Terjadi kesalahan saat menyimpan artikel');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {post ? 'Edit Artikel' : 'Artikel Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Masukkan judul artikel..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Tulis ringkasan singkat artikel..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Tulis konten artikel lengkap di sini..."
              rows={15}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange('published', checked)}
            />
            <Label htmlFor="published">
              Publikasikan artikel
            </Label>
          </div>

          <div className="flex items-center space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : (post ? 'Update Artikel' : 'Simpan Artikel')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
