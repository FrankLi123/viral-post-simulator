'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Repeat2, Share, BarChart3, User, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsModal from './AnalyticsModal';
import TweetDetailModal from './TweetDetailModal';
import { useNotifications } from './Layout';
import { useUser } from '@/hooks/useUser';

interface PostProps {
  content: string;
  timestamp: Date;
}

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
  baseLikes: number; // Base likes for growth calculation
  baseRetweets: number; // Base retweets for growth calculation
  baseReplies: number; // Base replies for growth calculation
}

const viralComments: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'retweets' | 'replies'>[] = [
  { author: 'Viral Enthusiast', handle: '@viralking', content: 'This is exactly what I needed! 🔥', verified: true, baseLikes: 47, baseRetweets: 12, baseReplies: 3 },
  { author: 'Tech Startup', handle: '@techstartup', content: 'Mind = blown! How did you think of this?', verified: false, baseLikes: 23, baseRetweets: 8, baseReplies: 1 },
  { author: 'Innovation Hub', handle: '@innovationhub', content: 'This could change everything! 🚀', verified: true, baseLikes: 89, baseRetweets: 34, baseReplies: 7 },
  { author: 'Future Builder', handle: '@futurebuilder', content: 'Already implementing this idea!', verified: false, baseLikes: 15, baseRetweets: 4, baseReplies: 0 },
  { author: 'CEO Daily', handle: '@ceodaily', content: 'Featured this in our newsletter! 📧', verified: true, baseLikes: 156, baseRetweets: 67, baseReplies: 12 },
  { author: 'Trend Spotter', handle: '@trendspotter', content: 'Called it! This is going viral 📈', verified: false, baseLikes: 78, baseRetweets: 29, baseReplies: 5 },
  { author: 'Product Punk', handle: '@producpunk', content: 'This needs to be on Product Hunt! 🚀', verified: true, baseLikes: 234, baseRetweets: 89, baseReplies: 18 },
  { author: 'Unicorn Ventures', handle: '@unicornvc', content: 'Solid execution. Would love to see more.', verified: true, baseLikes: 312, baseRetweets: 124, baseReplies: 23 },
  { author: 'TechCrunch', handle: '@techcrunch', content: 'Covering this in our next article! 📰', verified: true, baseLikes: 445, baseRetweets: 189, baseReplies: 34 },
  { author: 'Tech Visionary', handle: '@techvisionary', content: 'Interesting 🤔', verified: true, baseLikes: 2847, baseRetweets: 1234, baseReplies: 567 },
  { author: 'AI Ventures', handle: '@aiventures', content: 'Love seeing innovative applications! 🤖', verified: true, baseLikes: 1567, baseRetweets: 678, baseReplies: 123 },
  { author: 'Alpha Capital', handle: '@alphacap', content: 'This is the future we\'re investing in.', verified: true, baseLikes: 892, baseRetweets: 445, baseReplies: 78 },
  { author: 'VentureBeat', handle: '@venturebeat', content: 'Breaking: This post just went mega viral! 📊', verified: true, baseLikes: 678, baseRetweets: 267, baseReplies: 45 },
  { author: 'Growth Capital', handle: '@growthcapital', content: 'Impressive growth trajectory 📈', verified: true, baseLikes: 534, baseRetweets: 198, baseReplies: 29 },
  { author: 'Innovation CEO', handle: '@innovationceo', content: 'This is how innovation happens! 💡', verified: true, baseLikes: 743, baseRetweets: 321, baseReplies: 67 },
];

// Simple Animated Number Component with hydration fix
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!mounted) return <span className={className}>0</span>;

  return (
    <span className={`${className} ${isAnimating ? 'text-[#1d9bf0]' : ''} transition-colors duration-300`}>
      {formatNumber(displayValue)}
    </span>
  );
}

export default function Post({ content, timestamp }: PostProps) {
  const { setNotificationCount } = useNotifications();
  const userData = useUser();
  
  const [metrics, setMetrics] = useState({
    likes: 0,
    retweets: 0,
    comments: 0,
    views: 0,
  });
  
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTweetDetail, setShowTweetDetail] = useState(false);
  const [viralStage, setViralStage] = useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update notification count to reflect total engagement (likes + reposts + comments)
  useEffect(() => {
    if (mounted) {
      const totalEngagement = metrics.likes + metrics.retweets + metrics.comments;
      // Set notification count to total engagement
      setNotificationCount(totalEngagement);
    }
  }, [metrics.likes, metrics.retweets, metrics.comments, mounted, setNotificationCount]);

  // Safe timestamp calculation to prevent hydration issues
  const getTimestamp = () => {
    if (!mounted) return '0s';
    const diffInSeconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  // Function to update comment metrics over time
  const updateCommentMetrics = useCallback(() => {
    if (!mounted) return;
    
    setAllComments(prevComments => 
      prevComments.map(comment => {
        const timeSinceCreation = (Date.now() - comment.timestamp.getTime()) / 1000;
        const growthFactor = Math.min(timeSinceCreation / 300, 1); // Grow over 5 minutes
        const viralMultiplier = 1 + (viralStage * 0.2); // Slight boost during viral stages
        
        // Calculate new values
        const newLikes = Math.floor(comment.baseLikes * growthFactor * viralMultiplier * (0.3 + Math.random() * 0.4));
        const newRetweets = Math.floor(comment.baseRetweets * growthFactor * viralMultiplier * (0.1 + Math.random() * 0.15)); // Reduced to maintain 1:30 ratio
        const newReplies = Math.floor(comment.baseReplies * growthFactor * viralMultiplier * (0.1 + Math.random() * 0.2));
        
        return {
          ...comment,
          // Only increase, never decrease
          likes: Math.max(comment.likes, newLikes),
          retweets: Math.max(comment.retweets, newRetweets),
          replies: Math.max(comment.replies, newReplies),
        };
      })
    );
  }, [viralStage, mounted]);

  useEffect(() => {
    if (!mounted) return;

    let currentInterval: NodeJS.Timeout | null = null;
    const timeouts: NodeJS.Timeout[] = [];

    // Clear any existing interval when starting a new one
    const startNewInterval = (intervalFn: () => void, delay: number) => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      currentInterval = setInterval(intervalFn, delay);
    };

    // Stage 1: Initial engagement (0-10s) - Slow start
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          return {
            ...prev,
            likes: prev.likes + Math.floor(Math.random() * 5) + 1,
            views: prev.views + Math.floor(Math.random() * 25) + 10,
          };
        });
      }, 800);
    }, 1000));

    // Stage 2: Building momentum (10-30s) - Add retweets
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          return {
            ...prev,
            likes: prev.likes + Math.floor(Math.random() * 5) + 1,
            retweets: prev.retweets + Math.floor(Math.random() * 4) + 1,
            views: prev.views + Math.floor(Math.random() * 100) + 50,
          };
        });
      }, 600); // Faster interval
    }, 10000));

    // Stage 3: Comments start appearing (15s onwards)
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      let commentIndex = 0;
      const commentInterval = setInterval(() => {
        if (!mounted || commentIndex >= viralComments.length || hasReachedLimit) return;
        const comment: Comment = {
          ...viralComments[commentIndex],
          id: (commentIndex + 1).toString(),
          timestamp: new Date(timestamp.getTime() + (commentIndex + 1) * 3000 + 15000),
          likes: 0,
          retweets: 0,
          replies: 0,
        };
        setAllComments(prev => [...prev, comment]);
        setMetrics(prev => ({
          ...prev,
          comments: prev.comments + 1,
        }));
        commentIndex++;
      }, 3000);
      // Don't replace the main interval, just add comments
    }, 15000));

    // Stage 4: Viral explosion (30s) - Exponential growth
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(1);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 100) + 50; // 50-149
          const retweetsIncrease = Math.floor(Math.random() * 3) + 1; // 1-3 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 2000) + 1000; // 1000-2999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 200);
    }, 30000));

    // Stage 5: Mega viral (60s) - MUCH FASTER!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(2);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 500) + 300; // 300-799
          const retweetsIncrease = Math.floor(Math.random() * 14) + 7; // 7-20 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 20000) + 15000; // 15000-34999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 100); // Much faster: 100ms
    }, 60000));

    // Stage 6: BREAKING Viral (90s) - EXPLOSIVE!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(3);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 1000) + 800; // 800-1799
          const retweetsIncrease = Math.floor(Math.random() * 26) + 20; // 20-45 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 40000) + 30000; // 30000-69999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 60); // Ultra fast: 60ms
    }, 90000));

    // Stage 7: MEGA VIRAL (120s) - Internet Breaker!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(4);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 2000) + 1500; // 1500-3499
          const retweetsIncrease = Math.floor(Math.random() * 51) + 37; // 37-87 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 80000) + 60000; // 60000-139999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 40); // Insane speed: 40ms
    }, 120000));

    // Stage 8: LEGENDARY (150s) - Global Phenomenon!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(5);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 4000) + 3000; // 3000-6999
          const retweetsIncrease = Math.floor(Math.random() * 101) + 75; // 75-175 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 150000) + 100000; // 100000-249999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 30); // Legendary speed: 30ms
    }, 150000));

    // Stage 9: ULTIMATE (180s) - Making History!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(6);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          const likesIncrease = Math.floor(Math.random() * 8000) + 6000; // 6000-13999
          const retweetsIncrease = Math.floor(Math.random() * 201) + 150; // 150-350 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 300000) + 200000; // 200000-499999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 20); // Ultimate speed: 20ms
    }, 180000));

    // Stage 10: WORLD RECORD (210s) - Biggest Viral Post Ever!
    timeouts.push(setTimeout(() => {
      if (hasReachedLimit || !mounted) return;
      setViralStage(7);
      setShowNotification(true);
      startNewInterval(() => {
        if (!mounted || hasReachedLimit) return;
        setMetrics(prev => {
          if (prev.views >= 10000000) { // 10M limit
            setHasReachedLimit(true);
            return prev;
          }
          const likesIncrease = Math.floor(Math.random() * 15000) + 10000; // 10000-24999
          const retweetsIncrease = Math.floor(Math.random() * 376) + 250; // 250-625 (1:40+ ratio)
          const newLikes = prev.likes + likesIncrease;
          const newRetweets = prev.retweets + retweetsIncrease;
          const newViews = prev.views + Math.floor(Math.random() * 500000) + 400000; // 400000-899999
          
          return {
            ...prev,
            likes: newLikes,
            retweets: newRetweets,
            views: newViews,
          };
        });
        updateCommentMetrics();
      }, 15); // World record speed: 15ms
    }, 210000));

    // Comment metrics growth interval - independent of main growth
    timeouts.push(setTimeout(() => {
      if (!mounted) return;
      const commentMetricsInterval = setInterval(() => {
        if (!hasReachedLimit && mounted) {
          updateCommentMetrics();
        }
      }, 2000);
    }, 18000));

    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [mounted, hasReachedLimit, timestamp, viralStage, updateCommentMetrics]);

  const getViralMessage = () => {
    switch (viralStage) {
      case 1:
        return "🔥 Your post is going viral!";
      case 2:
        return "🚀 You're trending! #1 in Technology";
      case 3:
        return "⚡ BREAKING: Viral explosion detected!";
      case 4:
        return "🌟 MEGA VIRAL! You broke the internet!";
      case 5:
        return "👑 LEGENDARY STATUS! Global phenomenon!";
      case 6:
        return "🎆 ULTIMATE VIRAL! Making history!";
      case 7:
        return "🌍 WORLD RECORD! Biggest viral post ever!";
      default:
        return "";
    }
  };

  const handleContentClick = () => {
    setShowTweetDetail(true);
  };

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAnalytics(true);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTweetDetail(true);
  };

  return (
    <>
      <div className="border-b border-[#2f3336] p-4 hover:bg-[#0a0a0a]/50 transition-colors">
        {/* Viral Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className={`mb-4 p-3 rounded-lg text-center font-bold ${
                viralStage === 3 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                  : 'bg-gradient-to-r from-[#1d9bf0] to-[#7c3aed]'
              }`}
              onAnimationComplete={() => {
                setTimeout(() => setShowNotification(false), viralStage === 3 ? 5000 : 3000);
              }}
            >
              {getViralMessage()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Header */}
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={24} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">{userData.name}</span>
              <span className="text-[#71767b]">@{userData.handle}</span>
              <span className="text-[#71767b]">·</span>
              <span className="text-[#71767b]">{getTimestamp()}</span>
              <button className="ml-auto text-[#71767b] hover:text-white">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            {/* Post Content - Clickable */}
            <div 
              className="mt-2 text-white text-lg leading-6 cursor-pointer hover:bg-[#1a1a1a]/30 rounded-lg p-2 -m-2 transition-colors"
              onClick={handleContentClick}
            >
              {content}
            </div>
            
            {/* Post Metrics - Fixed alignment */}
            <div className="flex items-center justify-between mt-4 max-w-md">
              <button 
                className="flex items-center text-[#71767b] hover:text-[#1d9bf0] group"
                onClick={handleCommentClick}
              >
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <MessageCircle size={18} />
                </div>
                <AnimatedNumber value={metrics.comments} className="text-sm ml-1" />
              </button>
              
              <button className="flex items-center text-[#71767b] hover:text-[#00ba7c] group">
                <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                  <Repeat2 size={18} />
                </div>
                <AnimatedNumber value={metrics.retweets} className="text-sm ml-1" />
              </button>
              
              <button className="flex items-center text-[#71767b] hover:text-[#f91880] group">
                <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors">
                  <Heart size={18} />
                </div>
                <AnimatedNumber value={metrics.likes} className="text-sm ml-1" />
              </button>
              
              <button 
                className="flex items-center text-[#71767b] hover:text-[#1d9bf0] group"
                onClick={handleAnalyticsClick}
              >
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <BarChart3 size={18} />
                </div>
                <AnimatedNumber value={metrics.views} className="text-sm ml-1" />
              </button>
              
              <button className="text-[#71767b] hover:text-[#1d9bf0] group">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                  <Share size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        metrics={metrics}
        content={content}
        timestamp={timestamp}
      />

      {/* Tweet Detail Modal */}
      <TweetDetailModal
        isOpen={showTweetDetail}
        onClose={() => setShowTweetDetail(false)}
        metrics={metrics}
        content={content}
        timestamp={timestamp}
        comments={allComments}
      />
    </>
  );
} 