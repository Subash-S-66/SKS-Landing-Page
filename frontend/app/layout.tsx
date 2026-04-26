import type { Metadata } from "next";
import "./globals.css";
import DynamicThemeProvider from "@/components/DynamicThemeProvider";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import AdminTrigger from "@/components/admin/AdminTrigger";
import Chatbot from "@/components/sections/Chatbot";
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: "SKS Services | Digital Transformation",
  description: "Web Development & Digital Solutions Freelancing Business",
};

// Fetch initial settings server-side to prevent flash of unstyled colors
async function getSettings() {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
  const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'your_internal_proxy_token_here_for_nextjs';

  try {
    const res = await fetch(`${BACKEND_URL}/settings`, {
      headers: { 'x-internal-token': INTERNAL_API_TOKEN },
      next: { revalidate: 60 }
    });
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  // Create inline style for CSS variables based on server-fetched settings
  const themeStyles = {
    '--primary': settings.primaryColor || '#00D4FF',
    '--secondary': settings.secondaryColor || '#7C3AED',
    '--darkBase': settings.darkBaseColor || '#080B14',
  } as React.CSSProperties;

  return (
    <html lang="en" className="scroll-smooth" style={themeStyles}>
      <body className="antialiased min-h-screen flex flex-col relative bg-darkBase text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <AdminTrigger />
        <Chatbot />
        <AdminLoginModal />
        <DynamicThemeProvider initialSettings={settings} />
      </body>
    </html>
  );
}
