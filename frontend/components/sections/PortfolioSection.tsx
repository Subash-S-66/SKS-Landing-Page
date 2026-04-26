'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export default function PortfolioSection({ initialProjects = [] }: { initialProjects?: any[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-[#0a0f1c]">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Work</h2>
            <div className="w-24 h-1 bg-secondary"></div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-secondary text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={project._id}
                className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.images[0] || 'https://via.placeholder.com/800x600'}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkBase via-darkBase/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-secondary font-bold text-sm mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="inline-block mt-auto text-white border border-white/30 rounded-full px-4 py-2 text-sm backdrop-blur-md self-start group-hover:bg-white group-hover:text-darkBase transition-colors">
                    View Project
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-10 bg-darkBase/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-[#0f1523] w-full max-w-5xl min-h-screen md:min-h-0 md:rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-darkBase/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-darkBase transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <div className="h-64 md:h-96 w-full relative">
                <img
                  src={selectedProject.images[0] || 'https://via.placeholder.com/1200x800'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1523] to-transparent"></div>
              </div>

              <div className="p-8 md:p-12 relative -mt-20">
                <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">{selectedProject.category}</span>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">{selectedProject.title}</h3>

                <div className="flex flex-wrap gap-2 mb-10">
                  {selectedProject.techStack.map(tech => (
                    <span key={tech} className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2">
                    <h4 className="text-xl font-bold text-white mb-4">About the Project</h4>
                    <div className="prose prose-invert prose-p:text-gray-400">
                      <p className="whitespace-pre-line">{selectedProject.fullDescription}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-fit">
                    <h4 className="text-lg font-bold text-white mb-4">Links</h4>
                    <div className="flex flex-col gap-4">
                      {selectedProject.liveUrl && (
                        <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-primary hover:text-white transition-colors p-3 bg-primary/10 rounded-lg">
                          <span className="font-semibold">Live Site</span>
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-gray-300 hover:text-white transition-colors p-3 bg-white/5 rounded-lg">
                          <span className="font-semibold">Source Code</span>
                          <Github size={18} />
                        </a>
                      )}
                      {!selectedProject.liveUrl && !selectedProject.githubUrl && (
                        <p className="text-gray-500 text-sm">Private client project</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
