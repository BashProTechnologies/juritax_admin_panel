import React from 'react';
import * as Icons from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  iconName: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, iconName, color }) => {
  const isCustomIcon = iconName.startsWith('data:image');
  // @ts-ignore
  const Icon = Icons[iconName] || Icons.HelpCircle;

  return (
    <div className="card p-6 flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 w-16 h-16 flex items-center justify-center overflow-hidden`}>
        {isCustomIcon ? (
          <img src={iconName} alt={label} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        ) : (
          <Icon size={28} />
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
