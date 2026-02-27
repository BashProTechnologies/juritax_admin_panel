import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Image as ImageIcon, Info, CheckCircle, Star, Users, Target, ShieldCheck, Eye, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AboutFeature {
  title: string;
  description: string;
  icon: string;
}

interface AboutData {
  hero_title: string;
  hero_subtitle: string;
  section_title: string;
  section_description: string;
  main_image: string;
  experience_text: string;
  features: AboutFeature[];
}

const AboutUsPage: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!data) return;
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Haqqımızda məlumatları yeniləndi!');
    }
  };

  const updateFeature = (index: number, field: keyof AboutFeature, value: string) => {
    if (!data) return;
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, features: newFeatures });
  };

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juritax-gold"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Haqqımızda İdarəetməsi</h1>
          <p className="text-gray-500 mt-2">Saytın "Haqqımızda" səhifəsindəki bütün məzmunu buradan tənzimləyin.</p>
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
                rows={2}
                value={data.hero_subtitle}
                onChange={e => setData({...data, hero_subtitle: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
              />
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Info className="text-juritax-gold" size={24} />
              <h3 className="text-xl font-bold">Əsas Məzmun</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BÖLMƏ BAŞLIĞI (MƏS: BİZ KİMİK?)</label>
                <input 
                  type="text" 
                  value={data.section_title}
                  onChange={e => setData({...data, section_title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BÖLMƏ TƏSVİRİ</label>
                <textarea 
                  rows={4}
                  value={data.section_description}
                  onChange={e => setData({...data, section_description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">TƏCRÜBƏ MƏTNİ (MƏS: 10+ İLLİK TƏCRÜBƏ)</label>
                <input 
                  type="text" 
                  value={data.experience_text}
                  onChange={e => setData({...data, experience_text: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                />
              </div>
            </div>
          </div>

          <div className="card p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <ImageIcon className="text-juritax-gold" size={24} />
              <h3 className="text-xl font-bold">Əsas Şəkil</h3>
            </div>
            
            <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
              {data.main_image ? (
                <>
                  <img src={data.main_image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-xs font-bold">Dəyişdir</label>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <p className="text-xs">Haqqımızda şəkli yükləyin</p>
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setData({...data, main_image: reader.result as string});
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <CheckCircle className="text-juritax-gold" size={24} />
            <h3 className="text-xl font-bold">Dəyərlərimiz / Üstünlüklərimiz</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feature, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl space-y-4 relative group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl text-juritax-gold shadow-sm">
                    {/* @ts-ignore */}
                    {React.createElement(Icons[feature.icon] || Icons.HelpCircle, { size: 24 })}
                  </div>
                  <div className="flex-1">
                    <select 
                      value={feature.icon}
                      onChange={e => updateFeature(idx, 'icon', e.target.value)}
                      className="text-[10px] bg-transparent border-none focus:ring-0 p-0 text-gray-400 uppercase font-bold cursor-pointer"
                    >
                      <option value="Users">Komanda (Users)</option>
                      <option value="Target">Yanaşma (Target)</option>
                      <option value="ShieldCheck">Keyfiyyət (ShieldCheck)</option>
                      <option value="Eye">Şəffaflıq (Eye)</option>
                      <option value="Star">Ulduz (Star)</option>
                      <option value="Heart">Ürək (Heart)</option>
                      <option value="Zap">Sürət (Zap)</option>
                    </select>
                    <input 
                      type="text" 
                      value={feature.title}
                      onChange={e => updateFeature(idx, 'title', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold text-gray-800"
                      placeholder="Başlıq"
                    />
                  </div>
                </div>
                <textarea 
                  rows={2}
                  value={feature.description}
                  onChange={e => updateFeature(idx, 'description', e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-500 resize-none"
                  placeholder="Təsvir"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutUsPage;
