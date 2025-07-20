import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Edit3, 
  Hash, 
  Image, 
  Eraser, 
  Scissors, 
  FileText,
  LogOut,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/write-article', label: 'Write Article', icon: Edit3 },
  { path: '/blog-titles', label: 'Blog Titles', icon: Hash },
  { path: '/generate-images', label: 'Generate Images', icon: Image },
  { path: '/remove-background', label: 'Remove Background', icon: Eraser },
  { path: '/review-resume', label: 'Review Resume', icon: FileText },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-72 bg-gradient-to-b from-purple-50 to-orange-50 border-r border-purple-200/30 min-h-screen shadow-xl">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <img 
            src="/ExpressFix (2).svg" 
            alt="ExpressFix Logo" 
            className="w-12 h-12 rounded-2xl shadow-lg"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            ExpressFix
          </span>
        </div>
        
        <div className="flex items-center gap-4 mb-10 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-200/30 shadow-lg">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-gray-800">William Mark</div>
            <div className="text-sm text-gray-600">Premium User</div>
          </div>
        </div>
        
        <nav className="space-y-3 mb-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:backdrop-blur-sm'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
