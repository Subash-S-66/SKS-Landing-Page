'use client';

import { useAppStore } from '@/lib/store';

export default function AdminTrigger() {
  const { setAdminModalOpen } = useAppStore();

  return (
    <div
      className="fixed bottom-0 left-0 w-[40px] h-[40px] bg-transparent cursor-default z-50"
      onClick={() => setAdminModalOpen(true)}
    />
  );
}
