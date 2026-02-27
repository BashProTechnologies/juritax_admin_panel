import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './Dashboard';
import ServicesPage from './ServicesPage';
import SocialMediaPage from './SocialMediaPage';
import ProductsPage from './ProductsPage';
import BlogPage from './BlogPage';
import AboutUsPage from './AboutUsPage';
import CorporatePage from './CorporatePage';
import ContactPage from './ContactPage';
import CertificatesPage from './CertificatesPage';
import ClientsPage from './ClientsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServicesPage />;
      case 'products':
        return <ProductsPage />;
      case 'blog':
        return <BlogPage />;
      case 'corporate':
        return <CorporatePage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'clients':
        return <ClientsPage />;
      case 'about':
        return <AboutUsPage />;
      case 'contact':
        return <ContactPage />;
      case 'social':
        return <SocialMediaPage />;
      default:
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-gray-400">
            <h2 className="text-2xl font-bold">Tezliklə...</h2>
            <p className="mt-2">Bu bölmə üzərində işlər davam edir.</p>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'İdarəetmə Paneli';
      case 'services': return 'Xidmətlər İdarəetmə Paneli';
      case 'social': return 'Sosial Media İdarəetməsi';
      case 'products': return 'Məhsullar';
      case 'blog': return 'Blog Yazıları';
      case 'corporate': return 'Korporativ Strategiya və Komanda';
      case 'certificates': return 'Sertifikatlar';
      case 'clients': return 'Müştəri Portfeli';
      case 'about': return 'Haqqımızda Məlumatları';
      case 'contact': return 'Əlaqə Məlumatları';
      case 'settings': return 'Tənzimləmələr';
      default: return 'Juritax Admin';
    }
  };

  return (
    <div className="flex min-h-screen bg-juritax-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={getTitle()} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        
        <footer className="p-6 text-center text-[10px] text-gray-400 border-t border-gray-200 bg-white">
          © 2026 Juritax Admin Panel. Bütün hüquqlar qorunur.
        </footer>
      </div>
    </div>
  );
}
