'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Home, List, Folder, MessageSquare, Settings, LogOut, Image as ImageIcon, Shield, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, setToken } = useAppStore();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          setToken(null);
          router.push('/');
        } else {
          setIsVerifying(false);
        }
      } catch (err) {
        setToken(null);
        router.push('/');
      }
    };

    verifyAccess();
  }, [token, router, setToken]);

  const handleLogout = () => {
    setToken(null);
    router.push('/');
  };

  if (isVerifying) return <div className="h-screen w-full bg-darkBase flex items-center justify-center text-white z-[200] absolute top-0 left-0">Verifying Access...</div>;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Services', href: '/admin/services', icon: List },
    { name: 'Portfolio', href: '/admin/portfolio', icon: Folder },
    { name: 'Testimonials', href: '/admin/testimonials', icon: ImageIcon },
    { name: 'Chatbot FAQs', href: '/admin/faqs', icon: MessageCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Account', href: '/admin/account', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 flex h-screen bg-[#080B14] text-white z-[150]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-primary">SKS Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0a0f1c] relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-darkBase">
          <h2 className="text-xl font-bold text-primary">SKS Admin</h2>
          <button onClick={handleLogout} className="text-gray-400">
            <LogOut size={24} />
          </button>
        </div>

        {/* Mobile Nav (simple text links for brevity) */}
        <div className="md:hidden p-4 border-b border-white/10 flex overflow-x-auto gap-4 bg-darkBase/50">
           {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm whitespace-nowrap text-gray-300 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-6 md:p-10 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
}
