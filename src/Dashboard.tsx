import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, Users, Activity, Mail, Download, Trash2 } from 'lucide-react';
import StatCard from './components/StatCard';
import { Stat, Log, Subscriber } from './types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
    fetch('/api/logs').then(res => res.json()).then(setLogs);
    fetchSubscribers();
  }, []);

  const fetchSubscribers = () => {
    fetch('/api/subscribers').then(res => res.json()).then(setSubscribers);
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Bu abunəçini silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
    if (res.ok) fetchSubscribers();
  };

  const exportSubscribers = () => {
    const emails = subscribers.map(s => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const statColors = {
    services: 'bg-orange-500',
    products: 'bg-blue-500',
    team: 'bg-emerald-500',
    blog: 'bg-purple-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İdarəetmə Paneli</h1>
        <p className="text-gray-500 mt-2">Sistem üzrə ümumi statistik göstəricilər və son fəaliyyətlər.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <StatCard 
            key={stat.id}
            label={stat.label}
            value={stat.value}
            iconName={stat.icon}
            // @ts-ignore
            color={statColors[stat.id] || 'bg-gray-500'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Logs */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="text-juritax-gold" size={20} />
              <h3 className="font-bold text-lg">Son Dəyişikliklər (Loglar)</h3>
            </div>
            <button className="text-juritax-gold text-sm font-semibold hover:underline">Hamısına bax</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">FƏALİYYƏT</th>
                  <th className="px-6 py-4 font-medium">TƏFƏRRÜAT</th>
                  <th className="px-6 py-4 font-medium">TARİX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length > 0 ? logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-juritax-gold"></div>
                        <span className="font-bold text-gray-800">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleString('az-AZ', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                      Hələ heç bir fəaliyyət qeydə alınmayıb.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Summary */}
        <div className="space-y-8">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Komanda Üzvləri</h3>
              <span className="text-xs text-gray-400">Cəmi 24</span>
            </div>
            <div className="flex items-center -space-x-3 mb-6">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                +20
              </div>
            </div>
            <button className="w-full py-3 bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              Hamısını idarə et
            </button>
          </div>

          <div className="card p-6 bg-juritax-gold/5 border-juritax-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-juritax-gold/10 text-juritax-gold rounded-lg">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-gray-800">Sistem Vəziyyəti</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bütün sistemlər qaydasındadır. Son 24 saat ərzində {logs.length} fəaliyyət qeydə alınıb.
            </p>
          </div>
        </div>
      </div>

      {/* Subscribers Section */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="text-juritax-gold" size={20} />
            <h3 className="font-bold text-lg">Abunəçilər</h3>
            <span className="bg-juritax-gold/10 text-juritax-gold text-xs px-2 py-1 rounded-full font-bold ml-2">
              {subscribers.length} nəfər
            </span>
          </div>
          <button 
            onClick={exportSubscribers}
            className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            <Download size={16} />
            Export (TXT)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">E-POÇT ÜNVANI</th>
                <th className="px-6 py-4 font-medium">ABUNƏ TARİXİ</th>
                <th className="px-6 py-4 font-medium text-right">ƏMƏLİYYAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.length > 0 ? subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{sub.email}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(sub.created_at).toLocaleDateString('az-AZ', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteSubscriber(sub.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                    Hələ heç bir abunəçi yoxdur.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
