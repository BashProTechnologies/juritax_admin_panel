import React from 'react';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-juritax-gold rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
