import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, MessageSquare, Star, Info } from 'lucide-react';
import { ContactInfo } from './types';

const ContactPage: React.FC = () => {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    const res = await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Əlaqə məlumatları yeniləndi!');
    }
  };

  if (loading || !data) return <div className="p-8">Yüklənir...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Əlaqə İdarəetməsi</h1>
          <p className="text-gray-500 mt-2">Saytın "Əlaqə" səhifəsindəki məlumatları buradan tənzimləyin.</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={20} />
          Yadda Saxla
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Hero Section */}
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Star className="text-juritax-gold" size={24} />
            <h3 className="text-xl font-bold">Hero Bölməsi</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">HERO BAŞLIQ</label>
              <input 
                type="text" 
                value={data.hero_title}
                onChange={e => setData({...data, hero_title: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-juritax-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">HERO ALTBAŞLIQ</label>
              <textarea 
                rows={3}
                value={data.hero_subtitle}
                onChange={e => setData({...data, hero_subtitle: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">DÜYMƏ MƏTNİ</label>
              <input 
                type="text" 
                value={data.button_text}
                onChange={e => setData({...data, button_text: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
              />
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Info className="text-juritax-gold" size={24} />
            <h3 className="text-xl font-bold">Əlaqə Məlumatları</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Phone size={14} /> Telefon
              </label>
              <input 
                type="text" 
                value={data.phone}
                onChange={e => setData({...data, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <Mail size={14} /> E-poçt
              </label>
              <input 
                type="email" 
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                <MapPin size={14} /> Ünvan
              </label>
              <input 
                type="text" 
                value={data.address}
                onChange={e => setData({...data, address: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">XƏRİTƏ URL (IFRAME SRC)</label>
              <input 
                type="text" 
                value={data.map_url}
                onChange={e => setData({...data, map_url: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
