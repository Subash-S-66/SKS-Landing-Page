'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import * as THREE from 'three';

// 3D Background Component
function ParticleWave() {
  const meshRef = useRef<any>(null);
  const count = 3000;

  const positions = new Float32Array(count * 3);
  for(let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.x = time * 0.02;
    }
  });

  return (
    // @ts-ignore
    <points ref={meshRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial size={0.05} color="#00D4FF" transparent opacity={0.6} sizeAttenuation />
    {/* @ts-ignore */}
    </points>
  );
}

export default function HeroSection() {
  const { settings } = useAppStore();
  const taglines = settings.heroTaglines || ['Web Development', 'Business Websites', 'Online Booking Systems', 'E-Commerce Solutions', 'Digital Transformation'];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 bg-darkBase">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          {/* @ts-ignore */}
          <ambientLight intensity={0.5} />
          <ParticleWave />
        </Canvas>
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay"></div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-darkBase/40 via-darkBase/80 to-darkBase pointer-events-none"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
        >
          {settings.businessName || 'SKS Services'}
        </motion.h1>

        <div className="h-12 mb-10">
          <motion.p
            key={currentTagline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl md:text-3xl font-light text-primary"
          >
            {taglines[currentTagline]}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#portfolio" className="px-8 py-4 bg-primary text-darkBase font-bold rounded-full hover:bg-white transition-colors">
            See My Work
          </a>
          <a href="#contact" className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
            Get a Free Quote
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
      >
        <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
      </motion.div>
    </section>
  );
}
