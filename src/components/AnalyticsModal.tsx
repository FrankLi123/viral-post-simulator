'use client';

import { useState, useEffect } from 'react';
import { X, BarChart3, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    likes: number;
    retweets: number;
    comments: number;
    views: number;
  };
  content: string;
  timestamp: Date;
}

export default function AnalyticsModal({ 
  isOpen, 
  onClose, 
  metrics, 
  content, 
  timestamp 
}: AnalyticsModalProps) {
  const [impressions, setImpressions] = useState(0);
  const [engagements, setEngagements] = useState(0);
  const [profileVisits, setProfileVisits] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Calculate derived metrics
      setImpressions(Math.floor(metrics.views * 1.2));
      setEngagements(metrics.likes + metrics.retweets + metrics.comments);
      setProfileVisits(Math.floor(metrics.views * 0.1));
    }
  }, [isOpen, metrics]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-black border border-[#2f3336] rounded-2xl z-50 flex flex-col max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2f3336]">
              <h2 className="text-xl font-bold">Post Analytics</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Post Preview */}
              <div className="mb-6 p-4 border border-[#2f3336] rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold">You</span>
                  <span className="text-[#71767b]">@yourhandle</span>
                  <span className="text-[#71767b]">·</span>
                  <span className="text-[#71767b]">{Math.floor((Date.now() - timestamp.getTime()) / 60000)}m</span>
                </div>
                <div className="text-white mb-4">{content}</div>
                
                {/* Mini metrics */}
                <div className="flex items-center space-x-6 text-[#71767b] text-sm">
            
                  <span> <Heart size={18} /> {formatNumber(metrics.likes)}</span>
                  <span> <Repeat2 size={18} /> {formatNumber(metrics.retweets)}</span>
                  <span>  <MessageCircle size={18} /> {formatNumber(metrics.comments)}</span>
            
                </div>
              </div>
              
              {/* Analytics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[#71767b] text-sm">Impressions</span>
                    <div className="w-4 h-4 bg-[#71767b] rounded-full flex items-center justify-center text-black text-xs">?</div>
                  </div>
                  <div className="text-3xl font-bold">{formatNumber(impressions)}</div>
                </div>
                
                <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[#71767b] text-sm">Engagements</span>
                    <div className="w-4 h-4 bg-[#71767b] rounded-full flex items-center justify-center text-black text-xs">?</div>
                  </div>
                  <div className="text-3xl font-bold">{formatNumber(engagements)}</div>
                </div>
                
                <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[#71767b] text-sm">Detail expands</span>
                    <div className="w-4 h-4 bg-[#71767b] rounded-full flex items-center justify-center text-black text-xs">?</div>
                  </div>
                  <div className="text-3xl font-bold">{Math.floor(metrics.views * 0.05)}</div>
                </div>
                
                <div className="bg-[#16181c] border border-[#2f3336] rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[#71767b] text-sm">Profile visits</span>
                    <div className="w-4 h-4 bg-[#71767b] rounded-full flex items-center justify-center text-black text-xs">?</div>
                  </div>
                  <div className="text-3xl font-bold">{formatNumber(profileVisits)}</div>
                </div>
              </div>
              
              {/* Viral Status */}
              <div className="bg-gradient-to-r from-[#1d9bf0]/20 to-[#7c3aed]/20 border border-[#1d9bf0]/30 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-[#1d9bf0]">🚀 Viral Status</h3>
                <p className="text-sm text-[#71767b]">
                  Your post is performing {engagements > 50 ? 'exceptionally' : 'well'}! 
                  {engagements > 100 && ' You\'re trending in Technology 🔥'}
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[#2f3336] text-center">
              <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2 px-6 rounded-full transition-colors">
                Promote post
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 