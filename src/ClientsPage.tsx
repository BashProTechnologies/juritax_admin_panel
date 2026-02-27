import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, Image as ImageIcon, Layout, Eye, EyeOff } from 'lucide-react';
import { Client, ClientSettings } from './types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<ClientSettings>({
    title: '',
    subtitle: '',
    is_enabled: true
  });
  const [newClient, setNewClient] = useState({ logo: '', status: 'Aktiv' as const });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchSettings();
  }, []);

  const fetchClients = async () => {
    const res = await fetch('/api/clients');
    setClients(await res.json());
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/clients/settings');
    setSettings(await res.json());
  };

  const handleSaveSettings = async () => {
    const res = await fetch('/api/clients/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) alert('Tənzimləmələr yadda saxlanıldı!');
  };

  const handleAddClient = async () => {
    if (!newClient.logo) return alert('Logo mütləqdir!');
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
    if (res.ok) {
      fetchClients();
      setNewClient({ logo: '', status: 'Aktiv' });
      setIsAdding(false);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Bu müştərini silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (res.ok) fetchClients();
  };

  const handleToggleStatus = async (client: Client) => {
    const newStatus = client.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv';
    const res = await fetch(`/api/clients/${client.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...client, status: newStatus })
    });
    if (res.ok) fetchClients();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      {/* Settings Section */}
      <div className="card p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-juritax-gold/10 text-juritax-gold rounded-lg">
              <Layout size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Müştəri Portfeli Tənzimləmələri</h2>
              <p className="text-sm text-gray-500">Bölmənin başlığını və görünməsini idarə edin.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Bölməni Göstər:</span>
              <button 
                onClick={() => setSettings({...settings, is_enabled: !settings.is_enabled})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.is_enabled ? 'bg-juritax-gold' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.is_enabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <button onClick={handleSaveSettings} className="btn-primary flex items-center gap-2">
              <Save size={18} />
              Yadda saxla
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BAŞLIQ</label>
            <input 
              type="text" 
              value={settings.title}
              onChange={e => setSettings({...settings, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ALT BAŞLIQ</label>
            <input 
              type="text" 
              value={settings.subtitle}
              onChange={e => setSettings({...settings, subtitle: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
            />
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Müştəri Loqoları</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-juritax-gold text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-juritax-gold/90 transition-colors"
          >
            <Plus size={18} />
            Yeni Müştəri
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Add New Client Card */}
          {isAdding && (
            <div className="card p-4 border-2 border-dashed border-juritax-gold/30 flex flex-col gap-4">
              <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden relative group">
                {newClient.logo ? (
                  <img src={newClient.logo} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-2 opacity-20" />
                    <p className="text-[10px]">Logo yüklə</p>
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
                      reader.onloadend = () => setNewClient({...newClient, logo: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">Ləğv</button>
                <button onClick={handleAddClient} className="flex-1 py-2 bg-juritax-gold text-white rounded-lg text-xs font-bold">Əlavə et</button>
              </div>
            </div>
          )}

          {clients.map(client => (
            <div key={client.id} className="card p-4 group relative flex flex-col gap-3">
              <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-4">
                <img src={client.logo} alt="Müştəri" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${client.status === 'Aktiv' ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {client.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleStatus(client)}
                      className="text-gray-400 hover:text-juritax-gold transition-colors"
                      title={client.status === 'Aktiv' ? 'Deaktiv et' : 'Aktiv et'}
                    >
                      {client.status === 'Aktiv' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button 
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientsPage;
