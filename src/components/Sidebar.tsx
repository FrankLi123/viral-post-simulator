'use client';

import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  MoreHorizontal,
  TrendingUp
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';

interface SidebarProps {
  notificationCount?: number;
}

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Explore' },
  { icon: Bell, label: 'Notifications', showBadge: true },
  { icon: Mail, label: 'Messages' },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: User, label: 'Profile' },
  { icon: MoreHorizontal, label: 'More' },
];

export default function Sidebar({ notificationCount = 0 }: SidebarProps) {
  const userData = useUser();
  
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Logo */}
      <div className="mb-8 p-3">
        <TrendingUp size={32} className="text-[#1da1f2]" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const showNotificationBadge = item.showBadge && notificationCount > 0;
          
          return (
            <div
              key={item.label}
              className={`flex items-center space-x-4 p-3 rounded-full hover:bg-[#1a1a1a] cursor-pointer transition-colors relative ${
                item.active ? 'font-bold' : ''
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {/* Notification Badge */}
                {showNotificationBadge && (
                  <div className="absolute -top-1 -right-1 bg-[#1d9bf0] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {notificationCount > 999 ? '999+' : notificationCount}
                  </div>
                )}
              </div>
              <span className="text-xl hidden xl:block">{item.label}</span>
            </div>
          );
        })}
      </nav>
      
      {/* Post Button */}
      <div className="mt-auto mb-4">
        <button className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 px-8 rounded-full transition-colors">
          <span className="hidden xl:block">Post</span>
          <span className="xl:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H8.8c.4 0 .8-.3.8-.8s-.5-.7-1-.7z"/>
            </svg>
          </span>
        </button>
      </div>
      
      {/* User Profile */}
      <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-[#1a1a1a] cursor-pointer">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div className="hidden xl:block">
          <div className="font-bold">{userData.name}</div>
          <div className="text-gray-500 text-sm">@{userData.handle}</div>
        </div>
      </div>
    </div>
  );
} 