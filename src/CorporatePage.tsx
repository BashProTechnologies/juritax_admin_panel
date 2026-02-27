import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Image as ImageIcon, Users, Zap, Shield, Plus, Trash2, Linkedin, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';
import { CorporateInfo, TeamMember } from './types';

const CorporatePage: React.FC = () => {
  const [corporate, setCorporate] = useState<any>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [cRes, tRes] = await Promise.all([
      fetch('/api/corporate'),
      fetch('/api/team')
    ]);
    setCorporate(await cRes.json());
    setTeam(await tRes.json());
    setLoading(false);
  };

  const handleSaveCorporate = async () => {
    if (!corporate) return;
    const res = await fetch('/api/corporate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corporate)
    });
    if (res.ok) alert('Korporativ məlumatlar yeniləndi!');
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;
    const method = selectedMember.id ? 'PUT' : 'POST';
    const url = selectedMember.id ? `/api/team/${selectedMember.id}` : '/api/team';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedMember)
    });

    if (res.ok) {
      fetchData();
      alert('Komanda üzvü yadda saxlanıldı!');
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Bu üzvü silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      if (selectedMember?.id === id) setSelectedMember(null);
    }
  };

  const handleNewMember = () => {
    setSelectedMember({
      id: 0,
      name: 'Yeni Üzv',
      position: '',
      description: '',
      image: '',
      linkedin_url: '',
      show_linkedin: true,
      status: 'Aktiv'
    });
  };

  const updateValue = (index: number, field: string, val: string) => {
    const newValues = [...corporate.values];
    newValues[index] = { ...newValues[index], [field]: val };
    setCorporate({ ...corporate, values: newValues });
  };

  if (loading || !corporate) return <div className="p-8">Yüklənir...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Left Sidebar: Team List & Corporate Settings */}
      <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Korporativ Strateqiya</h2>
          <button onClick={handleSaveCorporate} className="btn-primary p-2">
            <Save size={18} />
          </button>
        </div>

        <div className="card p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">HERO BAŞLIQ</label>
            <input 
              type="text" 
              value={corporate.hero_title}
              onChange={e => setCorporate({...corporate, hero_title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">HERO ALTBAŞLIQ</label>
            <textarea 
              rows={3}
              value={corporate.hero_subtitle}
              onChange={e => setCorporate({...corporate, hero_subtitle: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Dəyərlərimiz</h3>
          {corporate.values.map((v: any, idx: number) => (
            <div key={idx} className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-juritax-gold/10 text-juritax-gold rounded-lg">
                  {/* @ts-ignore */}
                  {React.createElement(Icons[v.icon] || Icons.HelpCircle, { size: 18 })}
                </div>
                <input 
                  type="text" 
                  value={v.title}
                  onChange={e => updateValue(idx, 'title', e.target.value)}
                  className="flex-1 bg-transparent border-none font-bold text-sm p-0 focus:ring-0"
                />
              </div>
              <textarea 
                rows={2}
                value={v.description}
                onChange={e => updateValue(idx, 'description', e.target.value)}
                className="w-full bg-transparent border-none text-xs text-gray-500 p-0 focus:ring-0 resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-bold">Komandamız</h2>
          <button onClick={handleNewMember} className="bg-juritax-gold text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} />
            Yeni
          </button>
        </div>

        <div className="space-y-3">
          {team.map(member => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`w-full card p-3 flex items-center justify-between cursor-pointer transition-all ${
                selectedMember?.id === member.id ? 'bg-juritax-gold/10 border-juritax-gold ring-1 ring-juritax-gold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {member.image ? (
                    <img src={member.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Users size={16} /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-sm">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate uppercase">{member.position}</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: Editor */}
      <div className="flex-1 card p-8 overflow-y-auto">
        {selectedMember ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Üzv Redaktəsi</h2>
                <p className="text-gray-400 text-sm mt-1">Komanda üzvünün məlumatlarını tənzimləyin.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Aktiv</span>
                <button 
                  onClick={() => setSelectedMember({...selectedMember, status: selectedMember.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv'})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedMember.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedMember.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">PROFİL ŞƏKLİ</label>
                <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
                  {selectedMember.image ? (
                    <>
                      <img src={selectedMember.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-xs font-bold">Dəyişdir</label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={48} className="mb-2 opacity-20" />
                      <p className="text-xs">Şəkil yükləyin</p>
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
                        reader.onloadend = () => setSelectedMember({...selectedMember, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">AD SOYAD *</label>
                  <input 
                    type="text" 
                    value={selectedMember.name}
                    onChange={e => setSelectedMember({...selectedMember, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">VƏZİFƏ</label>
                  <input 
                    type="text" 
                    value={selectedMember.position}
                    onChange={e => setSelectedMember({...selectedMember, position: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-blue-400 tracking-wider flex items-center gap-2">
                      <Linkedin size={14} />
                      LINKEDIN PROFILI
                    </label>
                    <button 
                      onClick={() => setSelectedMember({...selectedMember, show_linkedin: !selectedMember.show_linkedin})}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${selectedMember.show_linkedin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {selectedMember.show_linkedin ? <Eye size={12} /> : <EyeOff size={12} />}
                      {selectedMember.show_linkedin ? 'GÖSTƏRİLİR' : 'GİZLİDİR'}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={selectedMember.linkedin_url}
                    onChange={e => setSelectedMember({...selectedMember, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-white border border-blue-100 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">HAQQINDA QISA MƏLUMAT</label>
              <textarea 
                rows={4}
                value={selectedMember.description}
                onChange={e => setSelectedMember({...selectedMember, description: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
                placeholder="Üzv haqqında qısa təsvir..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setSelectedMember(null)} className="btn-secondary">Ləğv et</button>
              <button onClick={handleSaveMember} className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Yadda saxla
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Users size={48} className="mb-4 opacity-20" />
            <p>Redaktə etmək üçün bir komanda üzvü seçin və ya yenisini əlavə edin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CorporatePage;
