'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, Save, X, HelpCircle } from 'lucide-react';

export default function FaqsPage() {
  const { token } = useAppStore();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setFaqs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFaqs();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingFaq._id;
    const url = isNew ? '/api/admin/faqs' : `/api/admin/faqs/${editingFaq._id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingFaq)
      });
      if (res.ok) {
        setEditingFaq(null);
        fetchFaqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = async (faq: any) => {
    try {
      await fetch(`/api/admin/faqs/${faq._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible: !faq.visible })
      });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Chatbot FAQs Manager</h1>
        <button
          onClick={() => setEditingFaq({ question: '', answer: '', order: 0, visible: true })}
          className="bg-primary text-darkBase px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add FAQ
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.map(faq => (
          <div key={faq._id} className={`bg-white/5 border rounded-2xl p-6 ${faq.visible ? 'border-white/10' : 'border-red-500/30 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary"/> {faq.question}
              </h3>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => setEditingFaq(faq)} className="p-2 text-gray-400 hover:text-white bg-black/30 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleDelete(faq._id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">{faq.answer}</p>
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-xs text-gray-500">Order: {faq.order}</span>
              <button
                onClick={() => toggleVisibility(faq)}
                className={`text-xs px-3 py-1 rounded-full ${faq.visible ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
              >
                {faq.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setEditingFaq(null)}><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingFaq._id ? 'Edit FAQ' : 'New FAQ'}</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Question</label>
                <input required value={editingFaq.question} onChange={e => setEditingFaq({...editingFaq, question: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Answer</label>
                <textarea required rows={5} value={editingFaq.answer} onChange={e => setEditingFaq({...editingFaq, answer: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Display Order</label>
                  <input type="number" value={editingFaq.order} onChange={e => setEditingFaq({...editingFaq, order: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div className="flex items-center mt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingFaq.visible} onChange={e => setEditingFaq({...editingFaq, visible: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-darkBase" />
                    <span className="text-white">Visible on public site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/10 gap-4">
                <button type="button" onClick={() => setEditingFaq(null)} className="px-6 py-2 rounded-lg text-gray-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-darkBase font-bold rounded-lg hover:bg-white flex items-center gap-2">
                  <Save size={18} /> Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
