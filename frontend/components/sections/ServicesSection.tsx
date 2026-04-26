'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
}

export default function ServicesSection({ initialServices = [] }: { initialServices?: any[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-darkBase relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 md:text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What We Do</h2>
          <div className="w-24 h-1 bg-primary md:mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer group hover:bg-white/10 transition-all"
              onClick={() => setSelectedService(service)}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.shortDescription}</p>
              <span className="text-primary text-sm font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <span>→</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBase/80 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111827] border border-white/10 rounded-2xl p-8 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSelectedService(null)}
              >
                <X size={24} />
              </button>
              <div className="text-5xl mb-6">{selectedService.icon}</div>
              <h3 className="text-3xl font-bold text-white mb-4">{selectedService.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-8">{selectedService.description}</p>

              <a
                href="#contact"
                onClick={() => setSelectedService(null)}
                className="inline-block w-full text-center px-6 py-3 bg-primary text-darkBase font-bold rounded-lg hover:bg-white transition-colors"
              >
                Enquire about this service
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
