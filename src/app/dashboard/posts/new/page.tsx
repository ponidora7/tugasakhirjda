import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import PostEditor from '@/components/PostEditor';

export default async function NewPostPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tulis Artikel Baru
          </h1>
          <p className="text-gray-600 mt-2">
            Bagikan cerita dan pengetahuan Anda dengan dunia
          </p>
        </div>
        
        <PostEditor />
      </div>
    </div>
  );
}

