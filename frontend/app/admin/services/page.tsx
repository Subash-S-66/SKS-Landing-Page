'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function ServicesPage() {
  const { token } = useAppStore();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', {
        headers: { Authorization: `Bearer ${token}` } // Admin needs auth to see hidden ones
      });
      if (res.ok) setServices(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchServices();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingService._id;
    const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService._id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        setEditingService(null);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleVisibility = async (service: any) => {
    try {
      await fetch(`/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible: !service.visible })
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Services Manager</h1>
        <button
          onClick={() => setEditingService({ title: '', description: '', shortDescription: '', icon: '🌟', order: 0, visible: true })}
          className="bg-primary text-darkBase px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service._id} className={`bg-white/5 border rounded-2xl p-6 ${service.visible ? 'border-white/10' : 'border-red-500/30 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl">{service.icon}</span>
              <div className="flex gap-2">
                <button onClick={() => setEditingService(service)} className="p-2 text-gray-400 hover:text-white bg-black/30 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleDelete(service._id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">{service.shortDescription}</p>
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <span className="text-xs text-gray-500">Order: {service.order}</span>
              <button
                onClick={() => toggleVisibility(service)}
                className={`text-xs px-3 py-1 rounded-full ${service.visible ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
              >
                {service.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setEditingService(null)}><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingService._id ? 'Edit Service' : 'New Service'}</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm text-gray-400 mb-2">Icon (Emoji)</label>
                  <input required value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-2xl" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Short Description</label>
                <input required value={editingService.shortDescription} onChange={e => setEditingService({...editingService, shortDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Description</label>
                <textarea required rows={4} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Display Order</label>
                  <input type="number" value={editingService.order} onChange={e => setEditingService({...editingService, order: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div className="flex items-center mt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editingService.visible} onChange={e => setEditingService({...editingService, visible: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-darkBase" />
                    <span className="text-white">Visible on public site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/10 gap-4">
                <button type="button" onClick={() => setEditingService(null)} className="px-6 py-2 rounded-lg text-gray-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-darkBase font-bold rounded-lg hover:bg-white flex items-center gap-2">
                  <Save size={18} /> Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
