'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactSection() {
  const { settings } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    serviceInterestedIn: '',
    budgetRange: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '', email: '', phone: '', businessType: '', serviceInterestedIn: '', budgetRange: '', message: ''
        });
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-darkBase relative">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay opacity-[0.03] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's build something <span className="text-primary">amazing</span>.</h2>
            <p className="text-gray-400 mb-12 text-lg">
              Ready to transform your business? Drop us a line and we'll get back to you within 24 hours to discuss your project.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email</h4>
                  <a href={`mailto:${settings.contactEmail}`} className="text-gray-400 hover:text-white transition-colors">{settings.contactEmail || 'hello@sksservices.com'}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Phone</h4>
                  <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-white transition-colors">{settings.phone || '+44 123 456 789'}</a>
                </div>
              </div>

              {settings.whatsapp && (
                <div className="mt-8">
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1ebd5a] transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send size={48} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                    <p className="text-gray-400 mb-8">Thank you for reaching out. We have received your enquiry and will get back to you shortly.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-8 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Business Type *</label>
                        <input required type="text" name="businessType" value={formData.businessType} onChange={handleChange} placeholder="e.g. Clinic, Restaurant, Freelance" className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Service Interested In *</label>
                        <select required name="serviceInterestedIn" value={formData.serviceInterestedIn} onChange={handleChange} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                          <option value="">Select a service...</option>
                          <option value="Business Website">Business Website</option>
                          <option value="Online Booking">Online Booking</option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="Custom Software">Custom Software</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Budget Range *</label>
                        <select required name="budgetRange" value={formData.budgetRange} onChange={handleChange} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                          <option value="">Select budget...</option>
                          <option value="£500 - £1,000">£500 - £1,000</option>
                          <option value="£1,000 - £3,000">£1,000 - £3,000</option>
                          <option value="£3,000 - £5,000">£3,000 - £5,000</option>
                          <option value="£5,000+">£5,000+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                      <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-darkBase border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-darkBase font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : (
                        <>
                          Send Message <Send size={20} />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
