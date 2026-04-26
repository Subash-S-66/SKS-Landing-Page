'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function DynamicThemeProvider({ initialSettings = {} }: { initialSettings?: any }) {
  const { setSettings } = useAppStore();

  useEffect(() => {
    // Populate store with initial settings fetched server-side
    if (Object.keys(initialSettings).length > 0) {
      setSettings(initialSettings);
    }
  }, [initialSettings, setSettings]);

  return null;
}
