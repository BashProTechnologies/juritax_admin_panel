import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Plus, Trash2, Image as ImageIcon, Award, Eye, EyeOff, Search } from 'lucide-react';
import { Certificate, CertificateSettings } from './types';

const CertificatesPage: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [settings, setSettings] = useState<CertificateSettings | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [cRes, sRes] = await Promise.all([
      fetch('/api/certificates'),
      fetch('/api/certificates/settings')
    ]);
    setCerts(await cRes.json());
    setSettings(await sRes.json());
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    const res = await fetch('/api/certificates/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) alert('Sertifikat tənzimləmələri yeniləndi!');
  };

  const handleSaveCert = async () => {
    if (!selectedCert) return;
    const method = selectedCert.id ? 'PUT' : 'POST';
    const url = selectedCert.id ? `/api/certificates/${selectedCert.id}` : '/api/certificates';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedCert)
    });

    if (res.ok) {
      fetchData();
      alert('Sertifikat yadda saxlanıldı!');
    }
  };

  const handleDeleteCert = async (id: number) => {
    if (!confirm('Bu sertifikatı silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      if (selectedCert?.id === id) setSelectedCert(null);
    }
  };

  const handleNewCert = () => {
    setSelectedCert({
      id: 0,
      title: 'Yeni Sertifikat',
      image: '',
      status: 'Aktiv'
    });
  };

  if (loading || !settings) return <div className="p-8">Yüklənir...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Left Sidebar: List & Settings */}
      <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Sertifikatlar</h2>
          <button onClick={handleNewCert} className="bg-juritax-gold text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} />
            Yeni
          </button>
        </div>

        {/* Visibility Toggle & Title Setting */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              {settings.is_enabled ? <Eye className="text-juritax-gold" size={18} /> : <EyeOff className="text-gray-400" size={18} />}
              <span className="text-sm font-bold">{settings.is_enabled ? 'Bölmə Aktivdir' : 'Bölmə Bağlıdır'}</span>
            </div>
            <button 
              onClick={() => setSettings({...settings, is_enabled: !settings.is_enabled})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.is_enabled ? 'bg-juritax-gold' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.is_enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">BÖLMƏ BAŞLIĞI</label>
            <input 
              type="text" 
              value={settings.title}
              onChange={e => setSettings({...settings, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">BÖLMƏ ALTBAŞLIĞI</label>
            <textarea 
              rows={2}
              value={settings.subtitle}
              onChange={e => setSettings({...settings, subtitle: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs resize-none"
            />
          </div>
          <button onClick={handleSaveSettings} className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-2">
            <Save size={14} />
            Tənzimləmələri Saxla
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Sertifikat axtar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
          />
        </div>

        <div className="space-y-3">
          {certs.filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(cert => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`w-full card p-3 flex items-center justify-between cursor-pointer transition-all ${
                selectedCert?.id === cert.id ? 'bg-juritax-gold/10 border-juritax-gold ring-1 ring-juritax-gold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {cert.image ? (
                    <img src={cert.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Award size={16} /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-sm">{cert.title}</h4>
                  <p className={`text-[10px] uppercase font-bold ${cert.status === 'Aktiv' ? 'text-green-500' : 'text-red-400'}`}>
                    {cert.status}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteCert(cert.id); }}
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
        {selectedCert ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Sertifikat Redaktəsi</h2>
                <p className="text-gray-400 text-sm mt-1">Sertifikat məlumatlarını və şəklini tənzimləyin.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Aktiv</span>
                <button 
                  onClick={() => setSelectedCert({...selectedCert, status: selectedCert.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv'})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedCert.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedCert.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">SERTİFİKAT ŞƏKLİ</label>
                <div className="aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
                  {selectedCert.image ? (
                    <>
                      <img src={selectedCert.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                        reader.onloadend = () => setSelectedCert({...selectedCert, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">SERTİFİKAT ADI *</label>
                  <input 
                    type="text" 
                    value={selectedCert.title}
                    onChange={e => setSelectedCert({...selectedCert, title: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setSelectedCert(null)} className="btn-secondary">Ləğv et</button>
              <button onClick={handleSaveCert} className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Yadda saxla
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Award size={48} className="mb-4 opacity-20" />
            <p>Redaktə etmək üçün bir sertifikat seçin və ya yenisini əlavə edin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CertificatesPage;
