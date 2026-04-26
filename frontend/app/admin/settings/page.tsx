'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { token, setSettings: updateGlobalSettings } = useAppStore();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings'); // Public endpoint is fine to read
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setFormData({ ...formData, [key]: e.target.value.split('\n').filter(Boolean) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('Settings saved successfully');
        updateGlobalSettings(formData);

        // Update CSS variables if colors changed
        const root = document.documentElement;
        if (formData.primaryColor) root.style.setProperty('--primary', formData.primaryColor);
        if (formData.secondaryColor) root.style.setProperty('--secondary', formData.secondaryColor);
        if (formData.darkBaseColor) root.style.setProperty('--darkBase', formData.darkBaseColor);

        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-darkBase px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {message}
        </div>
      )}

      <form className="space-y-8">
        {/* General Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Business Name</label>
              <input name="businessName" value={formData.businessName || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
              <input name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">WhatsApp (Numbers only)</label>
              <input name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
            </div>
          </div>
        </div>

        {/* Branding & Colors */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Branding & Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Primary Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" name="primaryColor" value={formData.primaryColor || '#00D4FF'} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                <input name="primaryColor" value={formData.primaryColor || '#00D4FF'} onChange={handleChange} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Secondary Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" name="secondaryColor" value={formData.secondaryColor || '#7C3AED'} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                <input name="secondaryColor" value={formData.secondaryColor || '#7C3AED'} onChange={handleChange} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Dark Base Color (Hex)</label>
              <div className="flex gap-2">
                <input type="color" name="darkBaseColor" value={formData.darkBaseColor || '#080B14'} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                <input name="darkBaseColor" value={formData.darkBaseColor || '#080B14'} onChange={handleChange} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Site Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Hero Taglines (One per line)</label>
              <textarea
                rows={5}
                value={(formData.heroTaglines || []).join('\n')}
                onChange={(e) => handleArrayChange(e, 'heroTaglines')}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">About Section Text</label>
              <textarea
                name="aboutText"
                rows={4}
                value={formData.aboutText || ''}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
