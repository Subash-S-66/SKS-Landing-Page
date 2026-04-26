'use client';

import { useAppStore } from '@/lib/store';
import { Facebook, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const { settings, setAdminModalOpen } = useAppStore();

  let tapCount = 0;
  let tapTimer: NodeJS.Timeout | null = null;

  const handleCopyrightTap = () => {
    tapCount++;
    if (tapTimer) clearTimeout(tapTimer);

    tapTimer = setTimeout(() => {
      tapCount = 0;
    }, 1500);

    if (tapCount === 3) {
      setAdminModalOpen(true);
      tapCount = 0;
    }
  };

  return (
    <footer className="bg-darkBase border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">{settings.businessName || 'SKS Services'}</h2>
            <p className="text-gray-400 max-w-sm">
              {settings.aboutText || 'Transforming businesses through powerful, beautifully designed online platforms.'}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>{settings.contactEmail}</li>
              <li>{settings.phone}</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-gray-500 text-sm select-none"
            onClick={handleCopyrightTap}
          >
            &copy; {new Date().getFullYear()} {settings.businessName || 'SKS Services'}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built by SKS Services
          </p>
        </div>
      </div>
    </footer>
  );
}
