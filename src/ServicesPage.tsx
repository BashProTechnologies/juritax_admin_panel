import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Check, X, Save, ChevronRight, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Service } from './types';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    fetch('/api/services').then(res => res.json()).then(data => {
      setServices(data);
      if (data.length > 0 && !selectedService) {
        setSelectedService(data[0]);
      }
    });
  };

  const handleSave = async () => {
    if (!selectedService) return;
    
    const method = selectedService.id ? 'PUT' : 'POST';
    const url = selectedService.id ? `/api/services/${selectedService.id}` : '/api/services';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedService)
    });

    if (res.ok) {
      fetchServices();
      setIsEditing(false);
      alert('Məlumatlar yadda saxlanıldı!');
    }
  };

  const handleAddService = () => {
    const newS: Service = {
      id: 0,
      title: 'Yeni Xidmət',
      subtitle: '',
      description: '',
      icon: 'Briefcase',
      background_image: '',
      status: 'Aktiv',
      features: [],
      updated_at: new Date().toISOString()
    };
    setSelectedService(newS);
    setIsEditing(true);
  };

  const addFeature = () => {
    if (newFeature.trim() && selectedService) {
      setSelectedService({
        ...selectedService,
        features: [...selectedService.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (selectedService) {
      const updated = [...selectedService.features];
      updated.splice(index, 1);
      setSelectedService({ ...selectedService, features: updated });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Left List */}
      <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Mövcud Xidmətlər</h2>
          <button onClick={handleAddService} className="bg-juritax-gold text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} />
            Yeni
          </button>
        </div>

        <div className="space-y-4">
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => { setSelectedService(service); setIsEditing(false); }}
              className={`w-full card p-4 flex items-center justify-between text-left transition-all ${
                selectedService?.id === service.id ? 'bg-juritax-gold/10 border-juritax-gold ring-1 ring-juritax-gold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden transition-colors ${selectedService?.id === service.id ? 'bg-juritax-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {service.icon.startsWith('data:image') ? (
                    <img src={service.icon} alt="Icon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    /* @ts-ignore */
                    React.createElement(Icons[service.icon] || Icons.HelpCircle, { size: 20 })
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{service.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Son yeniləmə: 2 saat əvvəl</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  service.status === 'Aktiv' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {service.status}
                </span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 card p-8 overflow-y-auto">
        {selectedService ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Xidmət Redaktəsi</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedService.title} üçün məlumatları yeniləyin.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Aktiv</span>
                <button 
                  onClick={() => setSelectedService({...selectedService, status: selectedService.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv'})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedService.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedService.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ARXA FON ŞƏKİLİ</label>
                <div className="relative group aspect-video bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                  {selectedService.background_image ? (
                    <>
                      <img src={selectedService.background_image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icons.Image className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Icons.Image size={32} className="mb-2 opacity-20" />
                      <p className="text-xs">Şəkil yüklə</p>
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
                        reader.onloadend = () => {
                          setSelectedService({...selectedService, background_image: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BAŞLIQ *</label>
                  <input 
                    type="text" 
                    value={selectedService.title}
                    onChange={e => setSelectedService({...selectedService, title: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ALTBAŞLIQ</label>
                  <input 
                    type="text" 
                    value={selectedService.subtitle}
                    onChange={e => setSelectedService({...selectedService, subtitle: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">HAQQINDA *</label>
                <textarea 
                  rows={4}
                  value={selectedService.description}
                  onChange={e => setSelectedService({...selectedService, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
                />
                <p className="text-[10px] text-gray-400">Xidmət haqqında qısa məlumat (maksimum 200 simvol).</p>
              </div>
              <div className="w-48 space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">İKON</label>
                <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="p-3 bg-white rounded-xl text-juritax-gold shadow-sm w-16 h-16 flex items-center justify-center overflow-hidden">
                    {selectedService.icon.startsWith('data:image') ? (
                      <img src={selectedService.icon} alt="Icon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      /* @ts-ignore */
                      React.createElement(Icons[selectedService.icon] || Icons.HelpCircle, { size: 32 })
                    )}
                  </div>
                  <div className="w-full space-y-2">
                    <select 
                      value={selectedService.icon.startsWith('data:image') ? 'custom' : selectedService.icon}
                      onChange={e => {
                        if (e.target.value !== 'custom') {
                          setSelectedService({...selectedService, icon: e.target.value});
                        }
                      }}
                      className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="Briefcase">Çanta (Briefcase)</option>
                      <option value="Calculator">Kalkulyator (Calculator)</option>
                      <option value="Search">Axtarış (Search)</option>
                      <option value="Scale">Tərəzi (Scale)</option>
                      <option value="Plane">Təyyarə (Plane)</option>
                      <option value="Truck">Yük maşını (Truck)</option>
                      <option value="Monitor">Monitor (Monitor)</option>
                      <option value="ShoppingBag">Alış-veriş (ShoppingBag)</option>
                      <option value="HelpCircle">Sual (HelpCircle)</option>
                      <option value="Shield">Qalxan (Shield)</option>
                      <option value="FileText">Sənəd (FileText)</option>
                      <option value="Users">İnsanlar (Users)</option>
                      {selectedService.icon.startsWith('data:image') && <option value="custom">Yüklənmiş İkon</option>}
                    </select>
                    
                    <label className="block w-full text-center py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                      DƏYİŞDİR
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSelectedService({...selectedService, icon: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">Nələr Daxildir?</h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedService.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl group">
                    <div className="w-5 h-5 bg-juritax-gold rounded-md flex items-center justify-center text-white">
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{feature}</span>
                    <button onClick={() => removeFeature(idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 border-2 border-dashed border-gray-100 rounded-xl p-2">
                  <input 
                    type="text" 
                    placeholder="Yeni əlavə et"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addFeature()}
                    className="flex-1 bg-transparent text-sm p-2 focus:outline-none"
                  />
                  <button onClick={addFeature} className="p-2 text-gray-400 hover:text-juritax-gold">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setIsEditing(false)} className="btn-secondary">Ləğv et</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Yadda saxla
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <HelpCircle size={48} className="mb-4 opacity-20" />
            <p>Redaktə etmək üçün bir xidmət seçin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ServicesPage;
