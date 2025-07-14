'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

interface LayoutProps {
  children: ReactNode;
}

interface NotificationContextType {
  notificationCount: number;
  incrementNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  incrementNotification: () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export default function Layout({ children }: LayoutProps) {
  const [notificationCount, setNotificationCount] = useState(0);

  const incrementNotification = () => {
    setNotificationCount(prev => prev + 1);
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, incrementNotification }}>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <div className="w-64 xl:w-80 fixed h-full">
            <Sidebar notificationCount={notificationCount} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 ml-64 xl:ml-80 mr-0 xl:mr-80 border-x border-[#2f3336]">
            {children}
          </div>
          
          {/* Right Sidebar */}
          <div className="w-80 fixed right-0 h-full hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </NotificationContext.Provider>
  );
} 