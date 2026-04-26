'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';

export default function PortfolioPage() {
  const { token } = useAppStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setEditingProject({
          ...editingProject,
          images: [...(editingProject.images || []), data.url]
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...editingProject.images];
    newImages.splice(index, 1);
    setEditingProject({ ...editingProject, images: newImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingProject._id;
    const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject._id}`;
    const method = isNew ? 'POST' : 'PUT';

    // Parse tech stack if it's a string
    const projectToSave = { ...editingProject };
    if (typeof projectToSave.techStack === 'string') {
      projectToSave.techStack = projectToSave.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(projectToSave)
      });
      if (res.ok) {
        setEditingProject(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Portfolio Manager</h1>
        <button
          onClick={() => setEditingProject({ title: '', category: '', shortDescription: '', fullDescription: '', techStack: [], images: [], liveUrl: '', githubUrl: '', featured: false })}
          className="bg-primary text-darkBase px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="h-48 relative bg-black/50">
              {project.images && project.images[0] ? (
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={48} /></div>
              )}
              {project.featured && <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Featured</span>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => setEditingProject({ ...project, techStack: project.techStack.join(', ') })} className="p-1.5 bg-black/60 text-white rounded hover:bg-black"><Edit size={14} /></button>
                <button onClick={() => handleDelete(project._id)} className="p-1.5 bg-red-500/80 text-white rounded hover:bg-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs text-primary font-bold uppercase mb-1">{project.category}</span>
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-sm text-gray-400 mb-4 flex-1">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {project.techStack.slice(0, 3).map((tech: string, i: number) => (
                  <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">{tech}</span>
                ))}
                {project.techStack.length > 3 && <span className="text-[10px] text-gray-500">+{project.techStack.length - 3}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl w-full max-w-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setEditingProject(null)}><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingProject._id ? 'Edit Project' : 'New Project'}</h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input required value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category (e.g. E-Commerce, Clinic)</label>
                  <input required value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Short Description</label>
                <input required value={editingProject.shortDescription} onChange={e => setEditingProject({...editingProject, shortDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Description</label>
                <textarea required rows={5} value={editingProject.fullDescription} onChange={e => setEditingProject({...editingProject, fullDescription: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tech Stack (comma separated)</label>
                <input required value={editingProject.techStack} onChange={e => setEditingProject({...editingProject, techStack: e.target.value})} placeholder="Next.js, Tailwind, MongoDB..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Live URL (Optional)</label>
                  <input type="url" value={editingProject.liveUrl || ''} onChange={e => setEditingProject({...editingProject, liveUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">GitHub URL (Optional)</label>
                  <input type="url" value={editingProject.githubUrl || ''} onChange={e => setEditingProject({...editingProject, githubUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                <label className="block text-sm text-gray-400 mb-4">Project Images</label>

                <div className="flex flex-wrap gap-4 mb-4">
                  {editingProject.images?.map((img: string, i: number) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/50 cursor-pointer transition-colors bg-black/50">
                    {uploadingImage ? <span className="text-xs">Uploading...</span> : (
                      <>
                        <Plus size={24} />
                        <span className="text-xs mt-1">Upload</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">First image will be used as the thumbnail.</p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editingProject.featured} onChange={e => setEditingProject({...editingProject, featured: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary focus:ring-offset-darkBase" />
                  <span className="text-white">Featured Project (Shows at top)</span>
                </label>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/10 gap-4">
                <button type="button" onClick={() => setEditingProject(null)} className="px-6 py-2 rounded-lg text-gray-400 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary text-darkBase font-bold rounded-lg hover:bg-white flex items-center gap-2">
                  <Save size={18} /> Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
