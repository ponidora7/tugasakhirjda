// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle,
  Settings 
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Dashboard
            </h2>
            
            <nav className="space-y-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard/posts">
                  <FileText className="mr-2 h-4 w-4" />
                  Artikel Saya
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard/posts/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tulis Artikel
                </Link>
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}