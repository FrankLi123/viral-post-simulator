'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';

interface LayoutProps {
  children: ReactNode;
}

interface NotificationContextType {
  notificationCount: number;
  messageCount: number;
  incrementNotification: (count?: number) => void;
  setNotificationCount: (count: number) => void;
  incrementMessage: (count?: number) => void;
  setMessageCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  messageCount: 0,
  incrementNotification: () => {},
  setNotificationCount: () => {},
  incrementMessage: () => {},
  setMessageCount: () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export default function Layout({ children }: LayoutProps) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  const incrementNotification = (count: number = 1) => {
    setNotificationCount(prev => Math.min(prev + count, 9999)); // Cap at 9999 to avoid overflow
  };

  const setNotificationCountDirect = (count: number) => {
    setNotificationCount(Math.min(count, 9999)); // Cap at 9999 to avoid overflow
  };

  const incrementMessage = (count: number = 1) => {
    setMessageCount(prev => Math.min(prev + count, 1000)); // Cap at 1000 to show 999+
  };

  const setMessageCountDirect = (count: number) => {
    setMessageCount(Math.min(count, 1000)); // Cap at 1000 to show 999+
  };

  return (
    <NotificationContext.Provider value={{ 
      notificationCount, 
      messageCount,
      incrementNotification, 
      setNotificationCount: setNotificationCountDirect,
      incrementMessage,
      setMessageCount: setMessageCountDirect
    }}>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <div className="w-64 xl:w-80 fixed h-full">
            <Sidebar notificationCount={notificationCount} messageCount={messageCount} />
          </div>
          
          {/* Main Content - Made wider */}
          <div className="flex-1 ml-64 xl:ml-80 mr-0 xl:mr-72 border-x border-[#2f3336] max-w-[700px]">
            {children}
          </div>
          
          {/* Right Sidebar */}
          <div className="w-72 fixed right-0 h-full hidden xl:block">
            <RightSidebar />
          </div>
        </div>
        
        {/* Legal Disclaimer Footer - Positioned next to Post button */}
        <footer className="fixed bottom-10 right-4 xl:right-280 bg-[#16181c] border border-[#2f3336] rounded-lg py-6 px-7 max-w-100 shadow-lg">
          <div className="text-sm text-[#71767b]">
            <p className="mb-3">
              <strong className="text-[#1d9bf0]">📢 PARODY:</strong> Simulation app for entertainment only.
            </p>
            <p className="text-xs">
              ⚠️ Not affiliated with X/Twitter. All metrics are fake.
            </p>
          </div>
        </footer>
      </div>
    </NotificationContext.Provider>
  );
} 