'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Mail, Phone, Calendar, Check, X, Trash2 } from 'lucide-react';

export default function EnquiriesPage() {
  const { token } = useAppStore();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEnquiries();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnquiries();
      setSelectedEnquiry(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* List View */}
      <div className={`w-full ${selectedEnquiry ? 'hidden lg:block lg:w-1/3' : ''}`}>
        <h1 className="text-3xl font-bold text-white mb-6">Enquiries</h1>
        <div className="flex flex-col gap-3">
          {enquiries.map(enq => (
            <div
              key={enq._id}
              onClick={() => setSelectedEnquiry(enq)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedEnquiry?._id === enq._id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{enq.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${enq.status === 'New' ? 'bg-primary/20 text-primary' : enq.status === 'Replied' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                  {enq.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 truncate">{enq.serviceInterestedIn}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(enq.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      {selectedEnquiry && (
        <div className="w-full lg:w-2/3 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col relative h-fit min-h-[500px]">
          <button className="lg:hidden absolute top-4 right-4 p-2 text-gray-400" onClick={() => setSelectedEnquiry(null)}>
            <X size={24} />
          </button>

          <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedEnquiry.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Mail size={16} /> <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-primary">{selectedEnquiry.email}</a></span>
                {selectedEnquiry.phone && <span className="flex items-center gap-1"><Phone size={16} /> <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-primary">{selectedEnquiry.phone}</a></span>}
                <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-4 rounded-xl">
              <span className="text-xs text-gray-500 uppercase">Service</span>
              <p className="text-white font-medium">{selectedEnquiry.serviceInterestedIn}</p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl">
              <span className="text-xs text-gray-500 uppercase">Budget</span>
              <p className="text-white font-medium">{selectedEnquiry.budgetRange}</p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl col-span-2">
              <span className="text-xs text-gray-500 uppercase">Business Type</span>
              <p className="text-white font-medium">{selectedEnquiry.businessType}</p>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2">Message</h4>
            <div className="bg-black/30 p-6 rounded-xl text-gray-300 whitespace-pre-line leading-relaxed">
              {selectedEnquiry.message}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4">
            {selectedEnquiry.status === 'New' && (
              <button onClick={() => updateStatus(selectedEnquiry._id, 'Replied')} className="px-6 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <Check size={18} /> Mark as Replied
              </button>
            )}
            {selectedEnquiry.status !== 'Closed' && (
              <button onClick={() => updateStatus(selectedEnquiry._id, 'Closed')} className="px-6 py-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <X size={18} /> Mark as Closed
              </button>
            )}
            <button onClick={() => deleteEnquiry(selectedEnquiry._id)} className="px-6 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg flex items-center gap-2 font-medium transition-colors ml-auto">
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
