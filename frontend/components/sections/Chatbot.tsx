'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs', err);
      }
    };
    fetchFaqs();

    // Initial bot greeting
    setMessages([
      { sender: 'bot', text: 'Hi there! How can I help you today? Please choose a question below.' }
    ]);
  }, []);

  const handleQuestionClick = (faq: Faq) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: faq.question },
      { sender: 'bot', text: faq.answer }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-darkBase rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-12 w-80 sm:w-96 bg-darkBase border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-darkBase">
                  <MessageCircle size={16} />
                </div>
                <h3 className="font-bold text-white">SKS Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-darkBase rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none whitespace-pre-line'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* FAQ Options (Only show if last message is from bot to keep it clean) */}
              {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                <div className="flex flex-col gap-2 mt-4">
                  {faqs.map(faq => (
                    <button
                      key={faq._id}
                      onClick={() => handleQuestionClick(faq)}
                      className="text-left text-sm text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-black/20 text-center text-xs text-gray-500">
              Select a question above or use our <a href="#contact" onClick={() => setIsOpen(false)} className="text-primary hover:underline">Contact Form</a> for custom enquiries.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
