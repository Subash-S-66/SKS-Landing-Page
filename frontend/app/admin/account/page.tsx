'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Save, Shield } from 'lucide-react';

export default function AccountSettingsPage() {
  const { token } = useAppStore();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully. Please log in again.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage(data.error || 'Failed to update password');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl">
            <Shield size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Change Password</h2>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-darkBase px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50 mt-4"
          >
            <Save size={20} /> {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
