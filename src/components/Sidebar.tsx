import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingBag, 
  FileText, 
  Share2, 
  Settings, 
  LogOut,
  Info,
  Building2,
  MessageSquare,
  Award,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ana Səhifə', icon: LayoutDashboard },
    { id: 'services', label: 'Xidmətlər', icon: Briefcase },
    { id: 'products', label: 'Məhsullar', icon: ShoppingBag },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'corporate', label: 'Korporativ', icon: Building2 },
    { id: 'certificates', label: 'Sertifikatlar', icon: Award },
    { id: 'clients', label: 'Müştərilər', icon: Users },
    { id: 'about', label: 'Haqqımızda', icon: Info },
    { id: 'contact', label: 'Əlaqə', icon: MessageSquare },
    { id: 'social', label: 'Sosial Media', icon: Share2 },
    { id: 'settings', label: 'Tənzimləmələr', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-1">
          Juritax<span className="text-juritax-gold">.</span>
        </h1>
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-juritax-gold/5 text-juritax-gold border-r-4 border-juritax-gold'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-top border-gray-100">
        <button className="flex items-center gap-3 text-red-500 font-bold text-sm hover:opacity-80 transition-opacity">
          <LogOut size={20} />
          ÇIXIŞ
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
