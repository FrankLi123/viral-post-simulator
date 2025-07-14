'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { useNotifications } from './Layout';

interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  verified?: boolean;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  baseLikes: number;
  baseRetweets: number;
  baseReplies: number;
}

interface TweetDetailModalProps {
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
  comments: Comment[];
}

// Animated Number Component for comments
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (displayValue !== value) {
      setIsAnimating(true);
      setDisplayValue(value);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [value, displayValue, mounted]);

  if (!mounted) return <span className={className}>0</span>;

  return (
    <span className={`${className} ${isAnimating ? 'text-[#1d9bf0]' : ''} transition-colors duration-300`}>
      {displayValue}
    </span>
  );
}

export default function TweetDetailModal({ 
  isOpen, 
  onClose, 
  metrics, 
  content, 
  timestamp, 
  comments 
}: TweetDetailModalProps) {
  const { notificationCount } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (date: Date) => {
    if (!mounted) return '0s';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const getCommentTime = (commentTimestamp: Date) => {
    if (!mounted) return '0s';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - commentTimestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    return `${Math.floor(diffInSeconds / 3600)}h`;
  };

  const formatFullTime = (date: Date) => {
    if (!mounted) return '';
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black text-white z-50 overflow-hidden">
      <div className="flex h-full w-full justify-center">
        {/* Left Sidebar */}
        <div className="w-[275px] flex-shrink-0">
          <Sidebar notificationCount={notificationCount} />
        </div>

        {/* Main Content - Centered */}
        <div className="w-[700px] border-x border-[#2f3336] flex-shrink-0">
          {/* Header */}
          <div className="sticky top-0 bg-black/95 backdrop-blur-xl border-b border-[#2f3336] p-4 flex items-center space-x-8 z-10">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Post</h1>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            {/* Main Tweet */}
            <div className="px-4 py-3 border-b border-[#2f3336]">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">You</span>
                    <span className="text-[#71767b] text-sm">@yourhandle</span>
                    <button className="ml-auto text-[#71767b] hover:text-white p-1.5 hover:bg-[#1a1a1a] rounded-full transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tweet Content */}
              <div className="mt-3 mb-4">
                <div className="text-white text-[23px] leading-7 font-normal">
                  {content}
                </div>
              </div>
              
              {/* Time and Date */}
              <div className="text-[#71767b] text-[15px] mb-4 pb-4 border-b border-[#2f3336]">
                {formatFullTime(timestamp)} · <span className="font-bold text-white">{mounted ? formatNumber(metrics.views) : '0'}</span> Views
              </div>
              
              {/* Engagement Metrics - Properly aligned like Twitter */}
              {mounted && (metrics.retweets > 0 || metrics.likes > 0 || metrics.comments > 0) && (
                <div className="flex items-center space-x-6 py-3 border-b border-[#2f3336] text-[15px]">
               

               <div className="flex items-center space-x-1 hover:underline cursor-pointer">
                    <MessageCircle size={18} />
                      <span className="font-bold text-white">{formatNumber(metrics.comments)}</span>
                    
                      {/* <span className="text-[#71767b]">Replies</span> */}
                    </div>
                    
                    <div className="flex items-center space-x-1 hover:underline cursor-pointer">
                    <Repeat2 size={18} />
                      <span className="font-bold text-white">{formatNumber(metrics.retweets)}</span>
                      {/* <span className="text-[#71767b]">Reposts</span> */}
                      
                    </div>
                 
                  
                    <div className="flex items-center space-x-1 hover:underline cursor-pointer">
                    <Heart size={18} /> 
                      <span className="font-bold text-white">{formatNumber(metrics.likes)}</span>
                      {/* <span className="text-[#71767b]">Likes</span> */}
                    </div>
              
                
                </div>
              )}

              {/* Action Buttons
              <div className="flex items-center justify-around py-3 border-b border-[#2f3336] max-w-md">
                <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#1d9bf0]/10 text-[#71767b] hover:text-[#1d9bf0] transition-all duration-200">
                  <MessageCircle size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#00ba7c]/10 text-[#71767b] hover:text-[#00ba7c] transition-all duration-200">
                  <Repeat2 size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#f91880]/10 text-[#71767b] hover:text-[#f91880] transition-all duration-200">
                  <Heart size={18} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#1d9bf0]/10 text-[#71767b] hover:text-[#1d9bf0] transition-all duration-200">
                  <Share size={18} />
                </button>
              </div> */}
            </div>

            {/* Comments */}
            <div className="pb-20">
              {mounted && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-3 border-b border-[#2f3336] hover:bg-[#0a0a0a]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="font-bold text-white text-[15px]">{comment.author}</span>
                          {comment.verified && <span className="text-[#1d9bf0]">✓</span>}
                          <span className="text-[#71767b] text-[15px]">{comment.handle}</span>
                          <span className="text-[#71767b]">·</span>
                          <span className="text-[#71767b] text-[15px]">{getCommentTime(comment.timestamp)}</span>
                        </div>
                        <div className="text-white text-[15px] mb-2 leading-5">{comment.content}</div>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center max-w-md">
                          <button className="flex items-center space-x-2 mr-12 text-[#71767b] hover:text-[#1d9bf0] transition-colors group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                              <MessageCircle size={16} />
                            </div>
                            <AnimatedNumber value={comment.replies} className="text-[13px]" />
                          </button>
                          <button className="flex items-center space-x-2 mr-12 text-[#71767b] hover:text-[#00ba7c] transition-colors group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                              <Repeat2 size={16} />
                            </div>
                            <AnimatedNumber value={comment.retweets} className="text-[13px]" />
                          </button>
                          <button className="flex items-center space-x-2 mr-12 text-[#71767b] hover:text-[#f91880] transition-colors group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                              <Heart size={16} />
                            </div>
                            <AnimatedNumber value={comment.likes} className="text-[13px]" />
                          </button>
                          <button className="text-[#71767b] hover:text-[#1d9bf0] transition-colors group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                              <Share size={16} />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : mounted && comments.length === 0 ? (
                <div className="p-8 text-center text-[#71767b]">
                  <div className="text-4xl mb-2">💬</div>
                  <div className="text-lg font-bold mb-1 text-white">No replies yet</div>
                  <div className="text-sm">Be the first to reply to this post!</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[288px] flex-shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
} 