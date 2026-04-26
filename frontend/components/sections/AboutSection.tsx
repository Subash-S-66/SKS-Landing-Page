'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

function Counter({ end, label }: { end: number, label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth stop
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

      setCount(Math.floor(easeOutQuart * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="text-4xl md:text-5xl font-black text-primary mb-2">{count}+</div>
      <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function AboutSection() {
  const { settings } = useAppStore();

  return (
    <section id="about" className="py-24 bg-darkBase relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 -right-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About <span className="text-primary">{settings.businessName || 'SKS Services'}</span></h2>
            <div className="w-24 h-1 bg-primary mb-8"></div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {settings.aboutText || 'We are a premier digital agency dedicated to transforming businesses through powerful, beautifully designed online platforms.'}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              In today's digital age, a website is more than just a digital brochure. It's the engine of your business. We build systems that automate your workflow, capture leads, process payments, and wow your customers from the moment they land on your page.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">✓</div>
                <div>
                  <h4 className="text-white font-bold">Premium Quality</h4>
                  <p className="text-sm text-gray-400">Award-winning design aesthetics</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">✓</div>
                <div>
                  <h4 className="text-white font-bold">Complete Solutions</h4>
                  <p className="text-sm text-gray-400">From design to hosting and support</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <Counter end={50} label="Projects Completed" />
            <Counter end={45} label="Happy Clients" />
            <Counter end={5} label="Years Experience" />
            <Counter end={15} label="Services Offered" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
