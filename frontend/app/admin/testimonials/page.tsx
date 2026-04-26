'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function TestimonialsPage() {
  const { token } = useAppStore();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTestimonials(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingTestimonial._id;
    const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingTestimonial._id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingTestimonial)
      });
      if (res.ok) {
        setEditingTestimonial(null);
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = async (testimonial: any) => {
    try {
      await fetch(`/api/admin/testimonials/${testimonial._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible: !testimonial.visible })
      });
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Testimonials Manager</h1>
        <button
          onClick={() => setEditingTestimonial({ clientName: '', businessName: '', avatarUrl: '', starRating: 5, quote: '', visible: true })}
          className="bg-primary text-darkBase px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(test => (
          <div key={test._id} className={`bg-white/5 border rounded-2xl p-6 ${test.visible ? 'border-white/10' : 'border-red-500/30 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < test.starRating ? '★' : '☆'}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingTestimonial(test)} className="p-2 text-gray-400 hover:text-white bg-black/30 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleDelete(test._id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic mb-4 h-20 line-clamp-4">"{test.quote}"</p>
            <div className="flex items-center gap-3 border-t border-white/10 pt-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden">
                {test.avatarUrl ? <img src={test.avatarUrl} alt="" className="w-full h-full object-cover"/> : test.clientName.charAt(0)}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{test.clientName}</h4>
                <p className="text-xs text-gray-500">{test.businessName}</p>
              </div>
            </div>
            <div className="flex justify-end">
               <button
                onClick={() => toggleVisibility(test)}
                className={`text-xs px-3 py-1 rounded-full ${test.visible ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
              >
                {test.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setEditingTestimonial(null)}><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingTestimonial._id ? 'Edit Testimonial' : 'New Testimonial'}</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Client Name</label>
                  <input required value={editingTestimonial.clientName} onChange={e => setEditingTestimonial({...editingTestimonial, clientName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Name</label>
                  <input required value={editingTestimonial.businessName} onChange={e => setEditingTestimonial({...editingTestimonial, businessName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Avatar Image URL (Optional)</label>
                  <input type="url" value={editingTestimonial.avatarUrl || ''} onChange={e => setEditingTestimonial({...editingTestimonial, avatarUrl: e.target.value})} placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Star Rating (1-5)</label>
                  <input type="number" min="1" max="5" required value={editingTestimonial.starRating} onChange={e => setEditingTestimonial({...editingTestimonial, starRating: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Quote</label>
                <textarea required rows={4} value={editingTestimonial.quote} onChange={e => setEditingTestimonial({...editingTestimonial, quote: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"></textarea>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editingTestimonial.visible} onChange={e => setEditingTestimonial({...editingTestimonial, visible: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-darkBase" />
                  <span className="text-white">Visible on public site</span>
                </label>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/10 gap-4">
                <button type="button" onClick={() => setEditingTestimonial(null)} className="px-6 py-2 rounded-lg text-gray-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-darkBase font-bold rounded-lg hover:bg-white flex items-center gap-2">
                  <Save size={18} /> Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
