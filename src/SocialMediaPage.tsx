import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Share2 } from 'lucide-react';
import { SocialMedia } from './types';

const SocialMediaPage: React.FC = () => {
  const [socials, setSocials] = useState<SocialMedia[]>([]);

  useEffect(() => {
    fetch('/api/social').then(res => res.json()).then(setSocials);
  }, []);

  const handleUpdate = async (id: string, url: string, status: 'Aktiv' | 'Deaktiv') => {
    const res = await fetch(`/api/social/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, status })
    });
    if (res.ok) {
      alert(`${id} məlumatları yeniləndi!`);
    }
  };

  const icons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    whatsapp: MessageCircle
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sosial Media İdarəetməsi</h1>
        <p className="text-gray-500 mt-2">Sosial şəbəkə linklərini buradan əlavə edin, dəyişin və görünürlüyünü tənzimləyin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {socials.map(social => {
          const Icon = icons[social.id] || Share2;
          return (
            <div key={social.id} className="card p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{social.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      social.status === 'Aktiv' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {social.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const newStatus = social.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv';
                    setSocials(socials.map(s => s.id === social.id ? { ...s, status: newStatus } : s));
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${social.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${social.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">URL LİNKİ</label>
                <input 
                  type="text" 
                  value={social.url}
                  onChange={e => setSocials(socials.map(s => s.id === social.id ? { ...s, url: e.target.value } : s))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400">Son yenilənmə: 2 gün əvvəl</p>
                <button 
                  onClick={() => handleUpdate(social.id, social.url, social.status)}
                  className="bg-juritax-dark text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors flex items-center gap-2"
                >
                  <Save size={14} />
                  Yadda Saxla
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SocialMediaPage;
