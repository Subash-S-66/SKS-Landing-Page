'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface Testimonial {
  _id: string;
  clientName: string;
  businessName: string;
  avatarUrl?: string;
  starRating: number;
  quote: string;
}

export default function TestimonialsSection({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials', error);
      }
    };
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  // Duplicate for infinite scroll effect
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-[#0a0f1c] overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Client Success</h2>
        <div className="w-24 h-1 bg-secondary mx-auto"></div>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Left/Right Fade overlay */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0a0f1c] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0a0f1c] to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-8 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {doubledTestimonials.map((testimonial, i) => (
            <div
              key={`${testimonial._id}-${i}`}
              className="w-[350px] md:w-[450px] flex-shrink-0 bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className={`w-5 h-5 ${index < testimonial.starRating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-lg italic mb-8 min-h-[100px]">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl overflow-hidden border-2 border-white/20">
                  {testimonial.avatarUrl ? (
                    <img src={testimonial.avatarUrl} alt={testimonial.clientName} className="w-full h-full object-cover" />
                  ) : (
                    testimonial.clientName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.clientName}</h4>
                  <p className="text-sm text-gray-400">{testimonial.businessName}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
