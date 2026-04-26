'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageSquare, List, Folder, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAppStore();
  const [stats, setStats] = useState({
    enquiries: 0,
    newEnquiries: 0,
    services: 0,
    projects: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enqRes, srvRes, projRes] = await Promise.all([
          fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/services'), // Public endpoint is fine for count
          fetch('/api/projects')
        ]);

        if (enqRes.ok && srvRes.ok && projRes.ok) {
          const enquiries = await enqRes.json();
          const services = await srvRes.json();
          const projects = await projRes.json();

          setStats({
            enquiries: enquiries.length,
            newEnquiries: enquiries.filter((e: any) => e.status === 'New').length,
            services: services.length,
            projects: projects.length
          });
          setRecentEnquiries(enquiries.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    if (token) fetchData();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Enquiries</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.enquiries}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><MessageSquare size={20} /></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">New (Unread)</p>
              <h3 className="text-3xl font-bold text-primary mt-1">{stats.newEnquiries}</h3>
            </div>
            <div className="p-3 bg-primary/20 text-primary rounded-xl"><AlertCircle size={20} /></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Active Services</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.services}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-xl"><List size={20} /></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Portfolio Projects</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.projects}</h3>
            </div>
            <div className="p-3 bg-green-500/20 text-green-500 rounded-xl"><Folder size={20} /></div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Recent Enquiries</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-300">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Service</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentEnquiries.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No recent enquiries</td></tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-white">{enq.name}</td>
                    <td className="p-4 text-sm text-gray-400">{enq.serviceInterestedIn}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${enq.status === 'New' ? 'bg-primary/20 text-primary' : enq.status === 'Replied' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{new Date(enq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
