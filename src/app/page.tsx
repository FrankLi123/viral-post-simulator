'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Heart, MessageCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  handle: string;
}

export default function LandingPage() {
  const [userData, setUserData] = useState<UserData>({ name: '', handle: '' });
  const [isEntering, setIsEntering] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.name.trim() && userData.handle.trim()) {
      setIsEntering(true);
      
      // Route to the app with user data
      setTimeout(() => {
        const params = new URLSearchParams({
          name: userData.name.trim(),
          handle: userData.handle.trim()
        });
        router.push(`/app?${params.toString()}`);
      }, 1500);
    }
  };

  const handleHandleChange = (value: string) => {
    // Remove @ if user types it, and ensure it starts without @
    const cleanHandle = value.replace(/^@+/, '');
    setUserData(prev => ({ ...prev, handle: cleanHandle }));
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#1da1f2] rounded-full relative">
              <TrendingUp size={32} className="text-white" />
              <Zap size={14} className="absolute -top-1 -right-1 text-[#ffd700]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Viral Post Simulator</h1>
          <p className="text-[#71767b] text-lg">Experience the dopamine rush of going viral</p>
          <p className="text-[#71767b] text-sm mt-2">Safe, fun, and addictive ✨</p>
        </motion.div>

                  {/* Features Preview */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 text-center">
              <TrendingUp className="text-[#1d9bf0] mx-auto mb-2" size={24} />
              <div className="text-sm font-bold">1M+ Views</div>
              <div className="text-xs text-[#71767b]">Viral simulation</div>
            </div>
            <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 text-center">
              <Heart className="text-[#f91880] mx-auto mb-2" size={24} />
              <div className="text-sm font-bold">Real Metrics</div>
              <div className="text-xs text-[#71767b]">Authentic growth</div>
            </div>
            <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 text-center">
              <MessageCircle className="text-[#1d9bf0] mx-auto mb-2" size={24} />
              <div className="text-sm font-bold">Viral Comments</div>
              <div className="text-xs text-[#71767b]">From People</div>
            </div>
            <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 text-center">
              <Sparkles className="text-[#ffd700] mx-auto mb-2" size={24} />
              <div className="text-sm font-bold">Notifications</div>
              <div className="text-xs text-[#71767b]">Feel the rush</div>
            </div>
          </motion.div>

          {/* Input Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="w-full p-3 bg-[#16181c] border border-[#2f3336] rounded-xl text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[#71767b]">@</span>
              <input
                type="text"
                value={userData.handle}
                onChange={(e) => handleHandleChange(e.target.value)}
                placeholder="yourhandle"
                className="w-full p-3 pl-8 bg-[#16181c] border border-[#2f3336] rounded-xl text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!userData.name.trim() || !userData.handle.trim() || isEntering}
            className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
              userData.name.trim() && userData.handle.trim() && !isEntering
                ? 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white'
                : 'bg-[#2f3336] text-[#71767b] cursor-not-allowed'
            }`}
            whileHover={userData.name.trim() && userData.handle.trim() && !isEntering ? { scale: 1.02 } : {}}
            whileTap={userData.name.trim() && userData.handle.trim() && !isEntering ? { scale: 0.98 } : {}}
          >
            {isEntering ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entering the Simulation...</span>
              </div>
            ) : (
              'Start Going Viral! 🚀'
            )}
          </motion.button>
        </motion.form>

        {/* Legal Disclaimer */}
        <motion.div 
          className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-400 text-center">
            <strong>Disclaimer:</strong> This is a parody and simulation app for entertainment purposes only. 
            Not affiliated with X Corp, Twitter, or any social media platform. All simulated content and metrics are fake. 
            No real social media accounts are created or used.
          </p>
        </motion.div>

        {/* Preview */}
        {userData.name && userData.handle && (
          <motion.div 
            className="mt-6 p-4 bg-[#16181c] border border-[#2f3336] rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-[#71767b] mb-2">Preview:</div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                {userData.name[0]?.toUpperCase()}
              </div>
              <div>
                <span className="font-bold">{userData.name}</span>
                <span className="text-[#71767b] ml-1">@{userData.handle}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-[#71767b] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>100% safe simulation • No real social media required</p>
          <p className="mt-1">Get ready for the viral experience! 🔥</p>
        </motion.div>
      </div>
    </div>
  );
}
